<?php

/**
 * @package Controller
 */

/**
 * AuthController
 * 
 * Controla requisições de relacionadas a autenticação dos usuários no sistema.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */
class AuthController extends Zend_Controller_Action
{

	public function init()
	{
		$this->initView();
		$this->view->baseUrl = $this->_request->getBaseUrl();
		$this->view->user = Zend_Auth::getInstance()->getIdentity();
		$this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
		$this->view->title = 'Login';
	}

	public function indexAction ()
	{
		$this->view->noLayout = true;
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
	}

	public function loginAction ()
	{
		$this->view->noLayout = true;
		$this->view->message = '';
		if ($this->_request->isPost()) {
			// collect the data from the user
			Zend_Loader::loadClass('Zend_Filter_StripTags');
			$filter = new Zend_Filter_StripTags();
			$usuario = $filter->filter($this->_request->getPost('username'));
			$senha = $filter->filter($this->_request->getPost('password'));
			$rememberme = (bool)($this->_request->getPost('rememberme'));
			if (empty($usuario)) {
				$this->view->message = 'Favor entrar com um login.';
			} else {
				// setup Zend_Auth adapter for a database table
				Zend_Loader::loadClass('Zend_Auth_Adapter_DbTable');
				$db = Zend_Registry::get('database');
				$authAdapter = new Zend_Auth_Adapter_DbTable($db);
				$authAdapter->setTableName('user');
				$authAdapter->setIdentityColumn('login');
				$authAdapter->setCredentialColumn('password');
				// Set the input credential values to authenticate against
				$authAdapter->setIdentity($usuario);
				$authAdapter->setCredential(md5($senha));
				// do the authentication
				$auth = Zend_Auth::getInstance();
				$result = $auth->authenticate($authAdapter);
				if ($result->isValid()) {
					// success : store database row to auth's storage system
					// (not the password though!)
					$data = $authAdapter->getResultRowObject(null, 'passwd');

					// update lastlogin datetime
					$userModel = new Model_Db_User();
					$userModel->updateLastLogin($data->id);

					$auth->getStorage()->write($data);

					$authNamespace = new Zend_Session_Namespace('Zend_Auth');
					$authNamespace->user_id = $data->id;

					if ($rememberme) {
						$authNamespace->rememberme = 1;
					} else {
						$authNamespace->rememberme = 0;
					}

					$fazendaSession = new Zend_Session_Namespace('fazendaSession');
					// redirect to select fazenda
					if (!isset($fazendaSession->fazenda_id)) {
						$this->_redirect('/auth/fazenda');
					} else {
						die('ja tem');
					}

					if (isset($authNamespace->requestUri)) {
						$this->_redirect($authNamespace->requestUri);
					} else {
						$this->_redirect('/');
					}

				} else {
					// failure: clear database row from session
					$this->view->message = 'Falha no login';
					$this->view->render('index');
				}
			}
		} elseif (Zend_Auth::getInstance()->getIdentity()) {
			$this->_redirect('/');
		}
	}

	public function logoutAction ()
	{
		Zend_Auth::getInstance()->clearIdentity();
		Zend_Session::forgetMe();
		$this->_redirect('/');
	}

	public function fazendaAction ()
	{
		$fazendaModel = new Model_Db_Fazenda();
		$user_id = Zend_Auth::getInstance()->getIdentity()->id;

		$form = new Zend_Form();
		$fazendaSelect = $form->createElement('select', 'fazenda');
		$fazendaSelect->setRequired(true);

		$fazendas = $fazendaModel->getFazendaByUser($user_id);
		$fazendaSelect->addMultiOption(false, '-- FAZENDAS --');
		foreach ($fazendas as $fazenda) {
			$fazendaSelect->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

		if (Zend_Auth::getInstance()->getIdentity()->fazenda_id > 0) {
			$fazendaSelect->setValue(Zend_Auth::getInstance()->getIdentity()->fazenda_id);
		}
		$fazendaSelect->removeDecorator('Label')->removeDecorator('Tag');

		$this->view->fazenda = $fazendaSelect;
		$this->view->action = $this->getRequest()->getControllerName() . '/' . $this->getRequest()->getActionName();

		if ($this->getRequest()->isPost()) {
			if ($this->getRequest()->getParam('fazenda', false)) {
				$auth = Zend_Auth::getInstance();

				$_auth = (array) $auth->getIdentity();
				$_auth['fazenda_id'] = $this->getRequest()->getParam('fazenda');
				$_auth['fazenda_dsc'] = $fazendas[$this->getRequest()->getParam('fazenda')]['descricao'];
				foreach ($fazendas as $val) {
					if ($val['id'] == $_auth['fazenda_id']) {
						$_auth['fazenda_dsc'] = $val['descricao'];
					}
				}

				$auth->getStorage()->write((object) $_auth);

				$authNamespace = new Zend_Session_Namespace('Zend_Auth');
				if (isset($authNamespace->requestUri) && $authNamespace->requestUri != '/auth/fazenda') {
					$this->_redirect($authNamespace->requestUri);
				} else {
					$this->_redirect('/');
				}

			} else {
				print 'tem q selecionar';
			}
		} else {
		}
	}

}
