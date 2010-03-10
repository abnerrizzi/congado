<?php

/**
 * @package Controller
 */

/**
 * AtividadeagricolaController
 * 
 * Controla requisições de manipulação do tipo de atividade agricola.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */
class AtivagricolaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Atividade Agrícola';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$ativagricolaModel = new Model_Db_Ativagricola();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $ativagricolaModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'Ativagricola', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'ativagricola',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'ativagricola',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'ativagricola',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$ativagricolaForm = new Form_Ativagricola();
		$ativagricolaForm->setAction('/ativagricola/add');
		$ativagricolaForm->setMethod('post');
		$this->view->form = $ativagricolaForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($ativagricolaForm->isValid($formData)) {
				$cod = $ativagricolaForm->getValue('cod');
				$dsc = $ativagricolaForm->getValue('dsc');
				$ativagricolaModel = new Model_Db_Ativagricola();
				if ($ativagricolaModel->addAtivagricola($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$ativagricolaForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request			= $this->getRequest();
		$ativagricolaId		= (int)$request->getParam('id');
		$ativagricolaForm	= new Form_Ativagricola();
		
		$ativagricolaForm->setAction('/ativagricola/edit');
		$ativagricolaForm->setMethod('post');
		$ativagricolaModel = new Model_Db_Ativagricola();
		$ativagricolaForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($ativagricolaForm->isValid($request->getPost())) {
				$ativagricolaModel->updateAtivagricola($ativagricolaForm->getValues());
				$this->_redirect('ativagricola/index');
			}

		} else {

			if ($ativagricolaId > 0) {
				$result = $ativagricolaModel->getAtivagricola($ativagricolaId);
				$ativagricolaForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc');
		$this->view->form = $ativagricolaForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$ativagricolaForm = new Form_Ativagricola();
		$ativagricolaForm->setAction('ativagricola/delete');
		$ativagricolaForm->setMethod('post');
		$ativagricolaModel = new Model_Db_Ativagricola();

		if ($request->isPost() && $request->getParam('param', false) == 'ativagricola') {
			$ativagricolaId	= (int)$request->getParam('id');
			$ativagricolaModel->deleteAtivagricola($ativagricolaId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$ativagricolaId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$ativagricolaId.')';
		}
		$this->view->url = 'ativagricola/index';

	}

}
