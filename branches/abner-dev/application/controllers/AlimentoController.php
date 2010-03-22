<?php

/**
 * @package Controller
 */

/**
 * AlimentoController
 * 
 * Controla requisições de manipulação do tipo de alimento.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */
class AlimentoController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Regime Alimentar';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$alimentoModel = new Model_Db_Alimento();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $alimentoModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));
		
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
//		$fields[] = new Model_Grid_Fields('id', 'ID', 10);
		$fields[] = new Model_Grid_Fields('cod', 'C&oacute;digo', 20);
		$fields[] = new Model_Grid_Fields('dsc','Descri&ccedil;&atilde;o', 150);
		
		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'alimento',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'alimento',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'alimento',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function editAction()
	{

		$request		= $this->getRequest();
		$alimentoId		= (int)$request->getParam('id');
		$alimentoForm	= new Form_Alimento();
		$alimentoForm->setAction('/alimento/edit');
		$alimentoForm->setMethod('post');
		$alimentoModel = new Model_Db_Alimento();
		$alimentoForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
//			->setAttrib('disabled', 'disabled')
			->setAttrib('class', 'readonly')
			;
		
		
		if ($request->isPost()) {

			if ($alimentoForm->isValid($request->getPost())) {
				$alimentoModel->updateAlimento($alimentoForm->getValues());
				$this->_redirect('alimento/index');
			}
		} else {
			if ($alimentoId > 0) {
				$result = $alimentoModel->getAlimento($alimentoId);
				$alimentoForm->populate( $result );
			} else {
				throw new Exception("invalid record number.");
			}
		}
		$this->view->elements = array('id', 'cod', 'dsc');
		$this->view->form = $alimentoForm;

	}

	public function addAction()
	{

		$alimentoForm = new Form_Alimento();
		$alimentoForm->setAction('/alimento/add');
		$alimentoForm->setMethod('post');
		$this->view->form = $alimentoForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($alimentoForm->isValid($formData)) {
				$cod = $alimentoForm->getValue('cod');
				$dsc = $alimentoForm->getValue('dsc');
				$alimentoModel = new Model_Db_Alimento();
				if ($alimentoModel->addAlimento($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
				
			} else {
				$alimentoForm->populate($formData);
			}
		}

	}

	public function deleteAction()
	{

		$request		= $this->getRequest();
		$alimentoForm	= new Form_Alimento();
		$alimentoForm->setAction('/alimento/delete');
		$alimentoForm->setMethod('post');
		$alimentoModel = new Model_Db_Alimento();

		if ($request->isPost() && $request->getParam('param', false) == 'alimento') {
			$alimentoId	= (int)$request->getParam('id');
			$alimentoModel->deleteAlimento($alimentoId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
			$this->view->url = 'alimento/index';
		} else {
			$alimentoId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro ('.$alimentoId.')';
			$this->view->url = 'alimento/index';
		}

	}


}







