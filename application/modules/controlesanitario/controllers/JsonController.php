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
 * @version $Id: JsonController.php 558 2010-12-02 13:17:49Z bacteria_ $
 */

class Controlesanitario_JsonController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->initView();
		Zend_Layout::startMvc(array(
			'layout' => 'json',
		));
	}

	public function postDispatch()
	{
		$this->render('index');
	}

	public function doencaAction()
	{
		$doencaModel = new Model_Db_Sanitario();
		$doencas = $doencaModel->listJson(
			$cols = '*',
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('fazenda_id'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($doencas));
		$this->render('index');

	}

	public function ficharioAction()
	{

		$ficharioModel = new Model_Db_Fichario();
		$ficharios = $ficharioModel->listJsonFicharios(
			array(
				'id',
				'cod',
				'nome',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('fazenda_id'),
			$this->getRequest()->getParam('like', false),
			array('sexo' => $this->getRequest()->getParam('sexo', false))
		);
		$this->view->content = utf8_encode(json_encode($ficharios));
		$this->render('index');
	}

}
