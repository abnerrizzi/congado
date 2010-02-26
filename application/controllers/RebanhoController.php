<?php
/**
 * @package Controller
 */

/**
 * RebanhoController
 * 
 * Controla requisições de manipulação de rebanhos.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class RebanhoController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Rebanhos';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$rebanhoModel = new Model_Db_Rebanho();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $rebanhoModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'Rebanho', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'rebanho',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'rebanho',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'rebanho',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$rebanhoForm = new Form_Rebanho();
		$rebanhoForm->setAction('/rebanho/add');
		$rebanhoForm->setMethod('post');
		$this->view->form = $rebanhoForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($rebanhoForm->isValid($formData)) {
				$cod = $rebanhoForm->getValue('cod');
				$dsc = $rebanhoForm->getValue('dsc');
				$rebanhoModel = new Model_Db_Rebanho();
				if ($rebanhoModel->addRebanho($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$rebanhoForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request		= $this->getRequest();
		$rebanhoId		= (int)$request->getParam('id');
		$rebanhoForm	= new Form_Rebanho();
		
		$rebanhoForm->setAction('/rebanho/edit');
		$rebanhoForm->setMethod('post');
		$rebanhoModel = new Model_Db_Rebanho();
		$rebanhoForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($rebanhoForm->isValid($request->getPost())) {
				$rebanhoModel->updateRebanho($rebanhoForm->getValues());
				$this->_redirect('rebanho/index');
			}

		} else {

			if ($rebanhoId > 0) {
				$result = $rebanhoModel->getRebanho($rebanhoId);
				$rebanhoForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc', 'delete');
		$this->view->form = $rebanhoForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$rebanhoForm = new Form_Rebanho();
		$rebanhoForm->setAction('rebanho/delete');
		$rebanhoForm->setMethod('post');
		$rebanhoModel = new Model_Db_Rebanho();

		if ($request->isPost() && $request->getParam('param', false) == 'rebanho') {
			$rebanhoId	= (int)$request->getParam('id');
			$rebanhoModel->deleteRebanho($rebanhoId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$rebanhoId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$rebanhoId.')';
		}
		$this->view->url = 'rebanho/index';

	}


}
