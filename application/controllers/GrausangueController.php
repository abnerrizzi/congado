<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class GrausangueController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Graus de Sangue';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$grausangueModel = new Model_Db_Grausangue();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $grausangueModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));
		
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
			'module'	=> 'grausangue',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'grausangue',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'grausangue',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;
	}

	public function editAction()
	{
		$request		= $this->getRequest();
		$grausangueId	= (int)$request->getParam('id');
		$grausangueForm	= new Form_Grausangue();
		$grausangueForm->setAction('/grausangue/edit');
		$grausangueForm->setMethod('post');
		$grausangueModel = new Model_Db_Grausangue();
		$grausangueForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
//			->setAttrib('disabled', 'disabled')
			->setAttrib('class', 'readonly')
			;
		
		
		if ($request->isPost()) {

			if ($grausangueForm->isValid($request->getPost())) {
				$grausangueModel->updateGrausangue($grausangueForm->getValues());
				$this->_redirect('grausangue/index');
			}
		} else {
			if ($grausangueId > 0) {
				$result = $grausangueModel->getGrausangue($grausangueId);
				$grausangueForm->populate( $result );
			} else {
				throw new Exception("invalid record number.");
			}
		}
		$this->view->elements = array('id', 'cod', 'dsc', 'delete');
		$this->view->form = $grausangueForm;
	}

	public function addAction()
	{

		$grausangueForm = new Form_Grausangue();
		$grausangueForm->setAction('/grausangue/add');
		$grausangueForm->setMethod('post');
		$this->view->form = $grausangueForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($grausangueForm->isValid($formData)) {
				$cod = $grausangueForm->getValue('cod');
				$dsc = $grausangueForm->getValue('dsc');
				$grausangueModel = new Model_Db_Grausangue();
				if ($grausangueModel->addGrausangue($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$grausangueForm->populate($formData);
			}
		}
	}

	public function deleteAction()
	{
		$request		= $this->getRequest();
		$grausangueForm	= new Form_Grausangue();
		$grausangueForm->setAction('/grausangue/delete');
		$grausangueForm->setMethod('post');
		$grausangueModel = new Model_Db_Grausangue();

		if ($request->isPost() && $request->getParam('param', false) == 'grausangue') {
			$grausangueId	= (int)$request->getParam('id');
			$grausangueModel->deleteGrausangue($grausangueId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$grausangueId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro ('.$grausangueId.')';
		}
		$this->view->url = 'grausangue/index';

	}

}
