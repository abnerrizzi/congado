<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: CategoriaController.php 595 2011-01-13 17:01:24Z bacteria_ $
 * 
 */

class Movimentacao_AlimentarController extends Zend_Controller_Action
{

	public function init()
	{
		throw new Zend_Controller_Action_Exception('Funcionalidade n�o implementada.');

		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Movimenta��o :: Mudan�a Alimentar';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
	}

}
