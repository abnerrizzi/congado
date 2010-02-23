<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class UserController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Configuração de Usuário';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	/*
	 * @TODO: implementar tela de aviso para quando o usuario nao tiver permissao de admin
	 */
	public function indexAction()
	{

		if (!Zend_Auth::getInstance()->getIdentity()->admin) {
			$writer = new Zend_Log_Writer_Firebug();
			$logger = new zend_log($writer);

			$logger->log("Usuario sem permissao de admin para esta funcionalidade de listar usuarios", Zend_Log::CRIT);
			throw new Zend_Controller_Action_Exception('Acesso negado');
		}
		$gridModel = new Model_Grid($this->view->title);
		$userModel = new Model_Db_User();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'name');
		$_order	= $this->_getParam('sort', 'asc');
		$result = $userModel->getPaginatorAdapter($_by, $_order, array('id', 'name', 'login', 'admin'));

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
		$fields[] = new Model_Grid_Fields('name', 'Nome', 200);
		$fields[] = new Model_Grid_Fields('login', 'login', 64);
		$fields[] = new Model_Grid_Fields('admin', 'Administrador', 64);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'user',
			'action'	=> 'editprofile',
		));
		$gridModel->setDelete(array(
			'module'	=> 'user',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'user',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;
	}

	public function editprofileAction()
	{

		$auth = Zend_Auth::getInstance()->getStorage()->read();
		$adapter = new Zend_File_Transfer_Adapter_Http();

		$request		= $this->getRequest();
		$userId			= $request->getParam('id', (int)$auth->id);
		$userForm		= new Form_User();
		$userForm->setAction('/user/editprofile');
		$userForm->setMethod('post');
		
		$userModel		= new Model_Db_User();

		$userForm->getElement('login')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;


		$userForm->removeElement('background')
			;

		if ($request->isPost()) {
			if ($userForm->isValid($request->getPost())) {
				$updateReturn = $userModel->updateUser($userForm);
				if ($updateReturn != 0) {
					$this->render('warning');
				}
			} else {
				Zend_Debug::dump($userForm->getErrors());
			}
		} else {
			if ($userId > 0) {
				$result = $userModel->getUser($userId);
				$userForm->populate( $result );
			} else {
				throw new Zend_Exception("invalid record number.");
			}
		}
		if ($userId != $auth->id) {
			$this->view->elements = array('id', 'login', 'name', 'admin', 'newpass', 'delete');
		} else {
			$this->view->elements = array('id', 'login', 'name', 'perpage');
		}
		$this->view->form = $userForm;

	}

	public function addAction()
	{

		$userForm = new Form_User();
		$userForm->setName('adicionar_usuario');
		$userForm->setAction('/user/add');
		$userForm->setMethod('post');
		$this->view->form = $userForm;
		$this->view->elements = array('login', 'name', 'newpass', 'admin');

		$userForm->getElement('newpass')
			->setRequired(true);

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($userForm->isValid($formData)) {
				$cod = $userForm->getValue('cod');
				$dsc = $userForm->getValue('dsc');
				$userModel = new Model_Db_User();
				$values = $userForm->getValues(true);
				unset($values['id'], $values['submit'], $values['cancel']);
				if ($userModel->addUser($values)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$userForm->populate($formData);
			}
		}
	}

	public function changepassAction()
	{
		$auth = Zend_Auth::getInstance()->getStorage()->read();

		$request		= $this->getRequest();
		$userId			= (int)$auth->id;
		$userForm		= new Form_User();
		$userForm->setAction('/user/index');
		$userForm->setMethod('post');
		$userModel		= new Model_Db_User();

		$userForm->getElement('login')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		if ($request->isPost()) {
			if ($userForm->isValid($request->getPost())) {
				$updateReturn = $userModel->updateUser($userForm);
				if ($updateReturn == 0) {
					var_dump($updateReturn);
					die();
					throw new Zend_Exception('Erro atualizando dados do usuário');
				} else {
					$this->_redirect('/');
				}
			}
		} else {
			if ($userId > 0) {
				$result = $userModel->getUser($userId);
				$userForm->populate( $result );
			} else {
				throw new Zend_Exception("invalid record number.");
			}
		}
		$this->view->elements = array('id', 'login', 'oldpass', 'newpass', 'confirmpass');
		$this->view->form = $userForm;
	}

	public function warningAction()
	{
		
	}

	public function deleteAction()
	{
		$auth = Zend_Auth::getInstance()->getStorage()->read();

		$request = $this->getRequest();
		$userForm = new Form_User();
		$userForm->setAction('user/delete');
		$userForm->setMethod('post');
		$userModel = new Model_Db_User();

		if ($request->isPost() && $request->getParam('param', false) == 'user' && (int)$request->getParam('id') != (int)$auth->id) {
			$userId	= (int)$request->getParam('id');
			$userModel->deleteUser($userId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$userId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$userId.')';
		}
		$this->view->url = 'user/index';
	}
}
