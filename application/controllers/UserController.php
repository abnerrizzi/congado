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

		$request		= $this->getRequest();
		$userId			= (int)$auth->id;
		$userForm		= new Form_User();
		$userForm->setAction('/user/profile');
		$userForm->setMethod('post');
		$userModel		= new Model_Db_User();

		$userForm->getElement('nome')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		if ($request->isPost()) {
			if ($userForm->isValid($request->getPost())) {
				$userModel->updateuser($userForm->getValues());
				$this->_redirect('user/index');
			}
		} else {
			if ($userId > 0) {
				$result = $userModel->getUser($userId);
				$userForm->populate( $result );
			} else {
				throw new Exception("invalid record number.");
			}
		}
		$this->view->elements = array('id', 'nome', 'oldpass', 'newpass', 'confirmpass', 'perpage');
		$this->view->form = $userForm;

	}

	public function profileAction()
	{
		// action body
	}


}



