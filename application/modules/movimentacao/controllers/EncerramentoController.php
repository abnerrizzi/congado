<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Movimentacao_EncerramentoController extends Zend_Controller_Action
{

	public function init()
	{
		throw new Zend_Controller_Action_Exception('Funcionalidade n�o implementada.');

		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Movimenta��o :: Encerramento de Lacta��o';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
	}

}
