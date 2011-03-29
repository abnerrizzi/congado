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
 * @version $Id: LocalController.php 595 2011-01-13 17:01:24Z bacteria_ $
 */

class Tabela_LocalController extends Plugin_DefaultController
{

	public function init()
	{
		$this->view->title = 'Tabela :: Locais';
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
			'module'	=> 'tabela/local',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'tabela/local',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'tabela/local',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;

	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$localId	= (int)$request->getParam('id');
		$localForm	= new Form_Local();
		$localForm->setAction('/tabela/local/edit');
		$localForm->setMethod('post');
		$localModel = new Model_Db_Local();
		$localForm->getElement('local')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		if ($request->isPost()) {

			if ($localForm->isValid($request->getPost())) {
				$localModel->updateLocal($localForm->getValues());
				$this->_redirect('/'. $this->getRequest()->getControllerName());
			}

		} else {

			if ($localId > 0) {
				$result = $localModel->getLocal($localId);
				$localForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id', 'local', 'dsc', 'area', 'delete');
		$this->view->form = $localForm;
	}

	public function addAction()
	{

		$localForm = new Form_Local();
		$localForm->setAction('/tabela/local/add');
		$localForm->setMethod('post');
		$this->view->form = $localForm;
		$this->view->elements = array('local', 'dsc', 'area');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();

			if ($localForm->isValid($formData)) {
				$localForm->getElement('local')->addValidator(
					new Zend_Validate_Db_NoRecordExists(
						'local',
						'local'
					)
				);
			}


			if ($localForm->isValid($formData)) {
				$local = $localForm->getValue('local');
				$dsc = $localForm->getValue('dsc');
				$area = $localForm->getValue('area');
				$localModel = new Model_Db_Local();
				if ($localModel->addLocal($this->view->fazenda_id, $local, $dsc, $area)) {
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

		if ($request->isPost() && $request->getParam('param', false) == 'tabela/local') {
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
