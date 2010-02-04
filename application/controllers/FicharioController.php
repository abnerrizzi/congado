<?php

/**
 * @TODO: Calculo automatico de Grau de Sangue
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * 
 * @version: $Id$
 * 
 */

class FicharioController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Fichário';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$ficharioModel = new Model_Db_Fichario();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order = $this->_getParam('sort', 'asc');
		$result = $ficharioModel->getPaginatorAdapter($_by, $_order);

		/*
		 * Paginator
		 */
		$paginator = Zend_Paginator::factory($result);
		if (intval(Zend_Auth::getInstance()->getIdentity()->perpage) > 0) {
			$paginator->setItemCountPerPage(intval(Zend_Auth::getInstance()->getIdentity()->perpage));
		} else {
			$paginator->setItemCountPerPage(Zend_Registry::get('configuration')->pagination->itemCoutPerPage);
		}
		$paginator->setCurrentPageNumber($_page);

		/*
		 * Fields
		 */
		$fields[] = new Model_Grid_Fields('cod', 'Animal', 65);
		$fields[] = new Model_Grid_Fields('nome','Nome', 120);
		$fields[] = new Model_Grid_Fields('dt_nascimento','Dt Nasc.', 60);
		$fields[] = new Model_Grid_Fields('rgn','RGN', 60);
		$fields[] = new Model_Grid_Fields('fazenda_dsc','Fazenda', 320);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setAction(false);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'fichario',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'fichario',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'fichario',
			'action'	=> 'add',
		));
		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{
		$ficharioForm = new Form_Fichario();
		$ficharioForm->setAction('/fichario/add');
		$ficharioForm->setMethod('post');
		$this->view->form = $ficharioForm;

		/*
		 * Populando select de fazendas
		 */
		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$ficharioForm->getElement('fazenda_id')
			->addMultiOption(false, '--');
		foreach ($fazendas as $fazenda) {
			$ficharioForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($formData['grausangue_manual'] == '1') {
				$ficharioForm->getElement('grausangue_id')->setRequired(true);
			}
			if ($ficharioForm->isValid($formData)) {
				$ficharioModel = new Model_Db_Fichario();
				if ($ficharioModel->addFichario($ficharioForm->getValues())) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$ficharioForm->populate($formData);
			}
		}
	}

	public function editAction()
	{

		$request		= $this->getRequest();
		$ficharioId		= (int)$request->getParam('id');
		$ficharioForm	= new Form_Fichario();
		
		$ficharioForm->setAction('/fichario/edit');
		$ficharioForm->setMethod('post');
		$ficharioModel = new Model_Db_Fichario();
		$ficharioForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$ficharioForm->getElement('local_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$ficharioForm->getElement('categoria_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		/*
		 * Populando select de fazendas
		 */
		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$ficharioForm->getElement('fazenda_id')
			->addMultiOption(false, '--')
			->setAttrib('disabled', 'disabled')
		;
		foreach ($fazendas as $fazenda) {
			$ficharioForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

		if ($request->isPost()) {

			if ($ficharioForm->isValid($request->getPost())) {
				$ficharioModel->updateFichario($ficharioForm->getValues());
				$this->_redirect('fichario/index');
			}

		} else {

			if ($ficharioId > 0) {
				$result = $ficharioModel->getFichario($ficharioId);
				$ficharioForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc');
		$this->view->form = $ficharioForm;
		$this->view->array = $this->getGenealogia($ficharioId);

	}

	public function deleteAction()
	{
		$request = $this->getRequest();
		$ficharioForm = new Form_Fichario();
		$ficharioForm->setAction('fichario/delete');
		$ficharioForm->setMethod('post');
		$ficharioModel = new Model_Db_Fichario();

		if ($request->isPost() && $request->getParam('param', false) == 'fichario') {
			$ficharioId	= (int)$request->getParam('id');
			$ficharioModel->deleteFichario($ficharioId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$ficharioId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$ficharioId.')';
		}
		$this->view->url = 'fichario/index';
	}

	public function genealogiaAction()
	{

		if ($this->getRequest()->getParam('onlyHTML') == true) {
			Zend_Layout::startMvc(array(
				'layout' => 'empty'
			));
		}

		$id = (int)$this->getRequest()->getParam('id', false);
		if ($id > 0) {
			$ficharioModel = new Model_Db_Fichario();
			$animal = $ficharioModel->getFichario($id);
		} else {
			print 'erro: Animal invalido';
			throw new Exception("Animal invalido($id)");
		}

		$array = $this->getGenealogia($animal['id']);
		

		$filhos = $ficharioModel->getFilhos($id);
		if ($filhos) {
			$array['filhos'] = $filhos;
		} else {
			$array['filhos'] = false;
		}
		

		$this->view->array = $array;
		if ($this->getRequest()->getParam('onlyHTML') == true) {
			$this->render('genealogia-compact');
		} else {
			$this->render('genealogia-compact');
		}
	}

	public function jqgridAction()
	{

	}

	private function getGenealogia($id)
	{
		$ficharioModel = new Model_Db_Fichario();
		$animal = $ficharioModel->getFichario($id);
		$array = array();

		// Animal
		$array['id'] 		= $animal['id'];
		$array['cod'] 		= $animal['cod'];
		$array['nome'] 		= $animal['nome'];
		$array['pai']['id'] = $animal['pai_id'];
		$array['mae']['id'] = $animal['mae_id'];

		// 1a. Geracao PAI
		if ($array['pai']['id']) {
			$g1_pai = $ficharioModel->getGenealogia($array['pai']['id']);
			$array['pai']['cod'] 		= $g1_pai['cod'];
			$array['pai']['nome'] 		= $g1_pai['nome'];
			$array['pai']['pai']['id'] 	= $g1_pai['pai_id'];
			$array['pai']['mae']['id'] 	= $g1_pai['mae_id'];

			if ($array['pai']['pai']['id']) {
				$g2_pai = $ficharioModel->getGenealogia($array['pai']['pai']['id']);
				$array['pai']['pai']['cod'] 		= $g2_pai['cod'];
				$array['pai']['pai']['nome'] 		= $g2_pai['nome'];
				$array['pai']['pai']['pai']['id'] 	= $g2_pai['pai_id'];
				$array['pai']['pai']['mae']['id'] 	= $g2_pai['mae_id'];

				if ($array['pai']['pai']['pai']['id']) {
					$g3_pai = $ficharioModel->getGenealogia($array['pai']['pai']['pai']['id']);
					$array['pai']['pai']['pai']['cod'] 		= $g3_pai['cod'];
					$array['pai']['pai']['pai']['nome'] 		= $g3_pai['nome'];
					$array['pai']['pai']['pai']['pai']['id'] 	= $g3_pai['pai_id'];
					$array['pai']['pai']['pai']['mae']['id'] 	= $g3_pai['mae_id'];
				}

				if ($array['pai']['pai']['mae']['id']) {
					$g3_pai = $ficharioModel->getGenealogia($array['pai']['pai']['mae']['id']);
					$array['pai']['pai']['mae']['cod'] 		= $g3_pai['cod'];
					$array['pai']['pai']['mae']['nome'] 		= $g3_pai['nome'];
					$array['pai']['pai']['mae']['pai']['id'] 	= $g3_pai['pai_id'];
					$array['pai']['pai']['mae']['mae']['id'] 	= $g3_pai['mae_id'];
				}
			}

			if ($array['pai']['mae']['id']) {
				$g2_pai = $ficharioModel->getGenealogia($array['pai']['mae']['id']);
				$array['pai']['mae']['cod'] 		= $g2_pai['cod'];
				$array['pai']['mae']['nome'] 		= $g2_pai['nome'];
				$array['pai']['mae']['pai']['id'] 	= $g2_pai['pai_id'];
				$array['pai']['mae']['mae']['id'] 	= $g2_pai['mae_id'];

				if ($array['pai']['mae']['pai']['id']) {
					$g3_pai = $ficharioModel->getGenealogia($array['pai']['mae']['pai']['id']);
					$array['pai']['mae']['pai']['cod'] 		= $g3_pai['cod'];
					$array['pai']['mae']['pai']['nome'] 		= $g3_pai['nome'];
					$array['pai']['mae']['pai']['pai']['id'] 	= $g3_pai['pai_id'];
					$array['pai']['mae']['pai']['mae']['id'] 	= $g3_pai['mae_id'];
				}

				if ($array['pai']['mae']['mae']['id']) {
					$g3_pai = $ficharioModel->getGenealogia($array['pai']['mae']['mae']['id']);
					$array['pai']['mae']['mae']['cod'] 		= $g3_pai['cod'];
					$array['pai']['mae']['mae']['nome'] 		= $g3_pai['nome'];
					$array['pai']['mae']['mae']['pai']['id'] 	= $g3_pai['pai_id'];
					$array['pai']['mae']['mae']['mae']['id'] 	= $g3_pai['mae_id'];
				}
			}
		}

		// 1a. Geracao mae
		if ($array['mae']['id']) {
			$g1_mae = $ficharioModel->getGenealogia($array['mae']['id']);
			$array['mae']['cod'] 		= $g1_mae['cod'];
			$array['mae']['nome'] 		= $g1_mae['nome'];
			$array['mae']['pai']['id'] 	= $g1_mae['pai_id'];
			$array['mae']['mae']['id'] 	= $g1_mae['mae_id'];

			if ($array['mae']['pai']['id']) {
				$g2_pai = $ficharioModel->getGenealogia($array['mae']['pai']['id']);
				$array['mae']['pai']['cod'] 		= $g2_pai['cod'];
				$array['mae']['pai']['nome'] 		= $g2_pai['nome'];
				$array['mae']['pai']['pai']['id'] 	= $g2_pai['pai_id'];
				$array['mae']['pai']['mae']['id'] 	= $g2_pai['mae_id'];

				if ($array['mae']['pai']['pai']['id']) {
					$g3_pai = $ficharioModel->getGenealogia($array['mae']['pai']['pai']['id']);
					$array['mae']['pai']['pai']['cod'] 			= $g3_pai['cod'];
					$array['mae']['pai']['pai']['nome'] 		= $g3_pai['nome'];
					$array['mae']['pai']['pai']['pai']['id'] 	= $g3_pai['pai_id'];
					$array['mae']['pai']['pai']['mae']['id'] 	= $g3_pai['mae_id'];
				}

				if ($array['mae']['pai']['mae']['id']) {
					$g3_pai = $ficharioModel->getGenealogia($array['mae']['pai']['mae']['id']);
					$array['mae']['pai']['mae']['cod'] 			= $g3_pai['cod'];
					$array['mae']['pai']['mae']['nome'] 		= $g3_pai['nome'];
					$array['mae']['pai']['mae']['pai']['id'] 	= $g3_pai['pai_id'];
					$array['mae']['pai']['mae']['mae']['id'] 	= $g3_pai['mae_id'];
				}
			}
			if ($array['mae']['mae']['id']) {
				$g2_mae = $ficharioModel->getGenealogia($array['mae']['mae']['id']);
				$array['mae']['mae']['cod'] 		= $g2_mae['cod'];
				$array['mae']['mae']['nome'] 		= $g2_mae['nome'];
				$array['mae']['mae']['pai']['id'] 	= $g2_mae['pai_id'];
				$array['mae']['mae']['mae']['id'] 	= $g2_mae['mae_id'];

				if ($array['mae']['mae']['pai']['id']) {
					$g3_pai = $ficharioModel->getGenealogia($array['mae']['mae']['pai']['id']);
					$array['mae']['mae']['pai']['cod'] 			= $g3_pai['cod'];
					$array['mae']['mae']['pai']['nome'] 		= $g3_pai['nome'];
					$array['mae']['mae']['pai']['pai']['id'] 	= $g3_pai['pai_id'];
					$array['mae']['mae']['pai']['mae']['id'] 	= $g3_pai['mae_id'];
				}

				if ($array['mae']['mae']['mae']['id']) {
					$g3_pai = $ficharioModel->getGenealogia($array['mae']['mae']['mae']['id']);
					$array['mae']['mae']['mae']['cod'] 			= $g3_pai['cod'];
					$array['mae']['mae']['mae']['nome'] 		= $g3_pai['nome'];
					$array['mae']['mae']['mae']['pai']['id'] 	= $g3_pai['pai_id'];
					$array['mae']['mae']['mae']['mae']['id'] 	= $g3_pai['mae_id'];
				}
			}
		}
		return $array;
	}

}
