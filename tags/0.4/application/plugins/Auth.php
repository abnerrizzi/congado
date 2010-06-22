<?php
/**
 * @package Plugin
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Plugin
 * @version $Id$
 * 
 */

class Plugin_Auth extends Zend_Controller_Plugin_Abstract
{

	public function preDispatch(Zend_Controller_Request_Abstract $request)
	{
		$authNamespace = new Zend_Session_Namespace('Zend_Auth');
		if (!Zend_Auth::getInstance()->hasIdentity()) {
			Zend_Auth::getInstance()->clearIdentity();

			// Armazena URL requisitada para redirecionamento apos login
			$requestUri = substr($this->_request->getRequestUri(),
				strlen(Zend_Controller_Front::getInstance()->getBaseUrl())
			);

			if ($requestUri != '/auth/login') {
				$authNamespace->requestUri = $requestUri;
			}

			$request->setControllerName('auth');
			$request->setActionName('login');
			
		} else {
			// Caso ja esteja logado, apenas atribui novamente o tempo para expirar a sessao.
			$authNamespace->requestUri = substr($this->_request->getRequestUri(),
				strlen(Zend_Controller_Front::getInstance()->getBaseUrl()));
			$__timeout = (Zend_Registry::getInstance()->configuration->resources->session->timeout->inactive);
			$__remember = (Zend_Registry::getInstance()->configuration->resources->session->timeout->remember_me_seconds);
			if ($authNamespace->rememberme == 1) {
				$authNamespace->setExpirationSeconds($__remember);
				Zend_Session::rememberMe($__remember);
			} else {
				$authNamespace->setExpirationSeconds($__timeout);
			}
		}

	}

}