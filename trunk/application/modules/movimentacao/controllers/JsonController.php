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
 * @version $Id: JsonController.php 239 2010-04-19 14:47:17Z bacteria_ $
 */

class Movimentacao_JsonController extends Zend_Controller_Action
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

	public function examerepAction()
	{

		$rebanhoModel = new Model_Db_Examerep();
		$rebanhos = $rebanhoModel->listJson(
			array(
				'id',
				'data',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($rebanhos));
		$this->render('index');

	}

	public function sanitariomorteAction()
	{
		$request = $this->getRequest()->getParams();
		die();
	}

	public function animalAction()
	{
		$request = $this->getRequest();
		$x = array (
			'id',
			'cod',
			'nome',
			'now()',
		);

		$modelM = new Model_Db_Fichario();
	}

	public function animalpreventivoAction()
	{
		$animalModel = new Model_Db_Fichario();
		$data = array(
			'cod'			=> $this->getRequest()->getParam('cod'),
			'fazenda_id'	=> $this->getRequest()->getParam('fazenda_id'),
		);
		$return = $animalModel->findPreventivoMorte($data);
		$this->view->content = json_encode($return);
		$this->render('index');
	}

}
