<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: TecnicoController.php 58 2010-01-28 17:54:26Z bacteria_ $
 * 
 */

class TecnicoController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Técnico de Transferência';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$tecnicoModel = new Model_Db_Tecnico();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $tecnicoModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'Tecnico', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'tecnico',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'tecnico',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'tecnico',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$tecnicoForm = new Form_Tecnico();
		$tecnicoForm->setAction('/tecnico/add');
		$tecnicoForm->setMethod('post');
		$this->view->form = $tecnicoForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($tecnicoForm->isValid($formData)) {
				$cod = $tecnicoForm->getValue('cod');
				$dsc = $tecnicoForm->getValue('dsc');
				$tecnicoModel = new Model_Db_Tecnico();
				if ($tecnicoModel->addTecnico($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$tecnicoForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request		= $this->getRequest();
		$tecnicoId		= (int)$request->getParam('id');
		$tecnicoForm	= new Form_Tecnico();
		
		$tecnicoForm->setAction('/tecnico/edit');
		$tecnicoForm->setMethod('post');
		$tecnicoModel = new Model_Db_Tecnico();
		$tecnicoForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($tecnicoForm->isValid($request->getPost())) {
				$tecnicoModel->updateTecnico($tecnicoForm->getValues());
				$this->_redirect('tecnico/index');
			}

		} else {

			if ($tecnicoId > 0) {
				$result = $tecnicoModel->getTecnico($tecnicoId);
				$tecnicoForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc');
		$this->view->form = $tecnicoForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$tecnicoForm = new Form_Tecnico();
		$tecnicoForm->setAction('tecnico/delete');
		$tecnicoForm->setMethod('post');
		$tecnicoModel = new Model_Db_Tecnico();

		if ($request->isPost() && $request->getParam('param', false) == 'tecnico') {
			$tecnicoId	= (int)$request->getParam('id');
			$tecnicoModel->deleteTecnico($tecnicoId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$tecnicoId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$tecnicoId.')';
		}
		$this->view->url = 'tecnico/index';

	}


}
