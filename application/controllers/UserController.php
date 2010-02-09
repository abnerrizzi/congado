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

	public function indexAction()
	{

		$auth = Zend_Auth::getInstance()->getStorage()->read();
		$adapter = new Zend_File_Transfer_Adapter_Http();

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
				if ($updateReturn != 0) {
					$this->render('warning');
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
		$this->view->elements = array('id', 'login', 'name', 'perpage');
		$this->view->form = $userForm;

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

}
