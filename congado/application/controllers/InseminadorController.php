<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: InseminadorController.php 58 2010-01-28 17:54:26Z bacteria_ $
 * 
 */

class InseminadorController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Inseminadores';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$inseminadorModel = new Model_Db_Inseminador();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $inseminadorModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'C&oacute;digo', 20);
		$fields[] = new Model_Grid_Fields('dsc','Descri&ccedil;&atilde;o', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'inseminador',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'inseminador',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'inseminador',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$inseminadorForm = new Form_Inseminador();
		$inseminadorForm->setAction('/inseminador/add');
		$inseminadorForm->setMethod('post');
		$this->view->form = $inseminadorForm;
		$this->view->elements = array('cod', 'dsc', 'unidade');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($inseminadorForm->isValid($formData)) {
				$cod = $inseminadorForm->getValue('cod');
				$dsc = $inseminadorForm->getValue('dsc');
				$unidade = floatval($inseminadorForm->getValue('unidade'));
				$inseminadorModel = new Model_Db_Inseminador();
				if ($inseminadorModel->addInseminador($cod, $dsc, $unidade)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$inseminadorForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request			= $this->getRequest();
		$inseminadorId		= (int)$request->getParam('id');
		$inseminadorForm	= new Form_Inseminador();
		
		$inseminadorForm->setAction('/inseminador/edit');
		$inseminadorForm->setMethod('post');
		$inseminadorModel = new Model_Db_Inseminador();
		$inseminadorForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($inseminadorForm->isValid($request->getPost())) {
				$inseminadorModel->updateInseminador($inseminadorForm->getValues());
				$this->_redirect('inseminador/index');
			}

		} else {

			if ($inseminadorId > 0) {
				$result = $inseminadorModel->getInseminador($inseminadorId);
				$inseminadorForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc');
		$this->view->form = $inseminadorForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$inseminadorForm = new Form_Inseminador();
		$inseminadorForm->setAction('inseminador/delete');
		$inseminadorForm->setMethod('post');
		$inseminadorModel = new Model_Db_Inseminador();

		if ($request->isPost() && $request->getParam('param', false) == 'inseminador') {
			$inseminadorId	= (int)$request->getParam('id');
			$inseminadorModel->deleteInseminador($inseminadorId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$inseminadorId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$inseminadorId.')';
		}
		$this->view->url = 'inseminador/index';

	}


}







