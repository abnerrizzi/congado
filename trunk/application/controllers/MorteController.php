<?php
/**
 * @package Controller
 */

/**
 * MorteController
 * 
 * Controla requisições de manipulação de causas mortis.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class MorteController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Causas Mortis';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$morteModel = new Model_Db_Morte();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $morteModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'Morte', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'morte',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'morte',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'morte',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$morteForm = new Form_Morte();
		$morteForm->setAction('/morte/add');
		$morteForm->setMethod('post');
		$this->view->form = $morteForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($morteForm->isValid($formData)) {
				$cod = $morteForm->getValue('cod');
				$dsc = $morteForm->getValue('dsc');
				$morteModel = new Model_Db_Morte();
				if ($morteModel->addMorte($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$morteForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$morteId	= (int)$request->getParam('id');
		$morteForm	= new Form_Morte();
		
		$morteForm->setAction('/morte/edit');
		$morteForm->setMethod('post');
		$morteModel = new Model_Db_Morte();
		$morteForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($morteForm->isValid($request->getPost())) {
				$morteModel->updateMorte($morteForm->getValues());
				$this->_redirect('/'. $this->getRequest()->getControllerName());
			}

		} else {

			if ($morteId > 0) {
				$result = $morteModel->getMorte($morteId);
				$morteForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc', 'delete');
		$this->view->form = $morteForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$morteForm = new Form_Morte();
		$morteForm->setAction('morte/delete');
		$morteForm->setMethod('post');
		$morteModel = new Model_Db_Morte();

		if ($request->isPost() && $request->getParam('param', false) == 'morte') {
			$morteId	= (int)$request->getParam('id');
			$morteModel->deleteMorte($morteId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$morteId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$morteId.')';
		}
		$this->view->url = 'morte/index';

	}


}
