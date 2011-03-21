<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Test_DropdownController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Area de testes(2)';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->getFazendaByUser(Zend_Auth::getInstance()->getIdentity()->id);
		foreach ($fazendas as $key) {
			$x[$key['id']] = $key['descricao'];
		}

		$this->view->fazendas = $x;
		$this->view->selected = Zend_Auth::getInstance()->getIdentity()->fazenda_id;
	}

}
