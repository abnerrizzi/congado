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
 * @version $Id$
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

	public function postDispatch()
	{
		$this->render('index');
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
	}

	public function transferenciaAction()
	{
		$transferenciaModel = new Model_Db_Transferencia();
		$transferencias = $transferenciaModel->listJsonTransferencia(
			array(),
			$this->getRequest()->getParam('sortname', 'vaca'),
			$this->getRequest()->getParam('sortorder', 'asc'),
			$this->getRequest()->getParam('page', '1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($transferencias));
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
	}

	public function examerepAction()
	{

		$exameModel = new Model_Db_Examerep();
		$exames = $exameModel->listJson(
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
		$this->view->content = utf8_encode(json_encode($exames));

	}

	public function diagnosticoAction()
	{

		$_return['error'] = false;

		$request = $this->getRequest();
		$animalId = $request->getParam('id', false);
		if (!$animalId) {
			$_return['error'] = 'Animal nao encontrado';
		}
		$ficharioModel = new Model_Db_Fichario();
		$coberturaModel = new Model_Db_Cobertura();

		// Verificano origem do animal
		$ficharioModel->disableExceptions();
		$animal = $ficharioModel->getFichario($request->getParam('id', false));
		$venda = $ficharioModel->checkMovimentacaoVenda($animal['id']);
		if (strtolower($animal['origem']) == 'e') {
			$_return['error'] = 'Animal de origem externa';
		} elseif ($animal['categoria_id'] == 18 || $venda == false) {
			$_return['error'] = 'Animal Vendido';

		// Verificando Sexo
		} elseif (strtoupper($animal['sexo']) != "F") {
			$_return['error'] = 'Permitido apenas animais do sexo feminino';
		}

		// Buscar ultima cobertura
//		$coberturaModel->getLastCoberturaByFicharioId($animalId);
//		if ($_return['error'] != false) {
//			print_r($_return);
//		}
//		print_r($animal);
//		die('ok');


		/*
-         * verificar sexo
-         * verificar movimentacoes para encontrar possiveis vendas.
-         * verificar origem no fichario se animal eh externo ou nao
         * verificar coberturas ...
         * * verificar se existem coberturas sem diagnostico
         * * verificar se essas coberturas sem diagnosticos estao dentro do prazo
         * * e confirmar se serao automaticamente inseridas no banco de dados como vazia ou sei la como
         */

		$this->view->content = utf8_encode(json_encode($_return));

	}

}
