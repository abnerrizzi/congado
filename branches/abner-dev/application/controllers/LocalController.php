<?php

/**
 * @package Controller
 */

/**
 * LocalController
 * 
 * Controla requisições de manipulação de locais.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class LocalController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Locais';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$localModel = new Model_Db_Local();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $localModel->getPaginatorAdapter($_by, $_order);

		/*
		 * Paginator
		 */
		$paginator = Zend_Paginator::factory($result);
		if (intval(Zend_Auth::getInstance()->getIdentity()->perpage) > 0) {
			$paginator->setItemCountPerPage(intval(Zend_Auth::getInstance()->getIdentity()->perpage));
		} else {
			$paginator->setItemCountPerPage(Zend_Registry::get('configuration')->pagination->itemCoutPerPage);
		}
		$paginator->setCurrentPageNumber($_page);

		/*
		 * Fields
		 */
		$fields[] = new Model_Grid_Fields('fazenda', 'Fazenda', 350);
		$fields[] = new Model_Grid_Fields('local', 'Local', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);
		$fields[] = new Model_Grid_Fields('area','Área', 35);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'local',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'local',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'local',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$localId	= (int)$request->getParam('id');
		$localForm	= new Form_Local();
		$localForm->setAction('/local/edit');
		$localForm->setMethod('post');
		$localModel = new Model_Db_Local();
		$localForm->getElement('local')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		$localForm->getElement('fazenda_id')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$localForm->getElement('fazenda_id')
			->addMultiOption(false, '--');

		foreach ($fazendas as $fazenda) {
			$localForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

		if ($request->isPost()) {

			if ($localForm->isValid($request->getPost())) {
				$localModel->updateLocal($localForm->getValues());
				$this->_redirect('local/index');
			}

		} else {

			if ($localId > 0) {
				$result = $localModel->getLocal($localId);
				$localForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'fazenda_id' , 'local' , 'dsc' , 'area', 'delete');
		$this->view->form = $localForm;
	}

	public function addAction()
	{

		$localForm = new Form_Local();
		$localForm->setAction('/local/add');
		$localForm->setMethod('post');
		$this->view->form = $localForm;
		$this->view->elements = array('fazenda_id' , 'local' , 'dsc' , 'area');

		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$localForm->getElement('fazenda_id')
			->addMultiOption(false, '--');

		foreach ($fazendas as $fazenda) {
			$localForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();

			if ($localForm->isValid($formData)) {
				$localForm->getElement('local')->addValidator(
					new Zend_Validate_Db_NoRecordExists(
						'local',
						'local',
						'fazenda_id = '.$formData['fazenda_id']
					)
				);
			}


			if ($localForm->isValid($formData)) {
				$fazenda_id = $localForm->getValue('fazenda_id');
				$local = $localForm->getValue('local');
				$dsc = $localForm->getValue('dsc');
				$area = $localForm->getValue('area');
				$localModel = new Model_Db_Local();
				if ($localModel->addLocal($fazenda_id, $local, $dsc, $area)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				} else {
					die('erro no insert');
				}
			}
		}
	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$localForm = new Form_Local();
		$localForm->setAction('local/delete');
		$localForm->setMethod('post');
		$localModel = new Model_Db_Local();

		if ($request->isPost() && $request->getParam('param', false) == 'local') {
			$localId	= (int)$request->getParam('id');
			$localModel->deleteLocal($localId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$localId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$localId.')';
		}
		$this->view->url = 'local/index';

	}

}
