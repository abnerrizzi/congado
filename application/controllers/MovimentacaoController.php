<?php

class MovimentacaoController extends Zend_Controller_Action
{

    public function init()
    {
    	$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Movimentação';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
        // action body
        print '<pre>';
        Zend_Debug::dump($this->getRequest()->getParams());
        print '</pre>';
    }


}

