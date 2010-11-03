<?php

/**
 * @package Controller
 */

/**
 * JsonController
 * 
 * Controla requisições JSON.
 * 
 * Faz a interface de comunicação entre aplicações que utilizam JSON
 * e o banco de dados, transformando os dados necessários no formato JSON.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id: JsonController.php 372 2010-08-04 18:09:09Z bacteria_ $
 */

class Reproducao_JsonController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->initView();
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		Zend_Layout::startMvc(array(
			'layout' => 'json',
		));
	}

	public function coberturaAction()
	{
		$coberturaModel = new Model_Db_Cobertura();
		$coberturas = $coberturaModel->listJsonCobertura(
			array(),
			$this->getRequest()->getParam('sortname', 'vaca'),
			$this->getRequest()->getParam('sortorder', 'asc'),
			$this->getRequest()->getParam('page', '1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($coberturas));
		$this->render('index');
	}

	public function regimeAction()
	{
		$coberturaModel = new Model_Db_Cobertura();
		$coberturas = $coberturaModel->listJsonRegime(
			array(),
			$this->getRequest()->getParam('sortname', 'vaca'),
			$this->getRequest()->getParam('sortorder', 'asc'),
			$this->getRequest()->getParam('page', '1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($coberturas));
		$this->render('index');
	}

}
