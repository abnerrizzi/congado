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
				if (!$updateReturn) {
					throw new Zend_Exception('Erro atualizando dados do usuário');
					$this->_redirect('user/index');
				} else {
					$userForm = $updateReturn;
				}
			}
		} else {
			if ($userId > 0) {
				$result = $userModel->getUser($userId);
				$userForm->populate( $result );
			} else {
				throw new Exception("invalid record number.");
			}
		}
//		print '<pre>';print_r($result);die();
		$this->view->elements = array('id', 'login', 'name', 'oldpass', 'newpass', 'confirmpass', 'perpage');
		$this->view->form = $userForm;

	}

}



