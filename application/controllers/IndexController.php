<?php
/**
 * @package Controller
 */

/**
 * IndexController
 * 
 * Mostra a pagina inicial do sistema.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class IndexController extends Zend_Controller_Action
{

	public function init()
	{
		$this->view->title = 'Principal';
		$this->view->user = Zend_Auth::getInstance()->getIdentity();
	}

	public function indexAction()
	{
		$this->view->identity = Zend_Auth::getInstance()->getIdentity();
	}

}

