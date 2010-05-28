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
			'byId'			=> $this->getRequest()->getParam('byId', false),
		);
		$return = $animalModel->findPreventivoMorte($data);
		$this->view->content = json_encode($return);
		$this->render('index');
	}

	public function sanitariopreventivoAction()
	{

		$morteModel = new Model_Db_Sanitario();
		$morteModel->setTipo(2);
		if ($this->getRequest()->getParam('sortname', false)) {
			$sortname = $this->getRequest()->getParam('sortname', false);
		} elseif ($this->getRequest()->getParam('sidx', false)) {
			$sortname = $this->getRequest()->getParam('sidx', false);
		} else {
			$sortname = false;
		}

		if ($this->getRequest()->getParam('sortorder', false)) {
			$sortorder = $this->getRequest()->getParam('sortorder', false);
		} elseif ($this->getRequest()->getParam('sord', false)) {
			$sortorder = $this->getRequest()->getParam('sord', false);
		} else {
			$sortorder = 'asc';
		}

		if ($this->getRequest()->getParam('rp', false)) {
			$rp = $this->getRequest()->getParam('rp');
		} elseif ($this->getRequest()->getParam('rows', false)) {
			$rp = $this->getRequest()->getParam('rows');
		} else {
			$rp = 10;
		}

		$animais = $morteModel->listJsonMorte(
			array(
				'id',
				'nome',
				'data',
				'ocorrencia',
			),
			$sortname,
			$sortorder,
			$this->getRequest()->getParam('page','1'),
			$rp,
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false),
			array(
				'sexo' => $this->getRequest()->getParam('sexo', false),
			)
		);
		$this->view->content = utf8_encode(json_encode($animais));
		$this->render('index');
	}

}
