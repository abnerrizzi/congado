<?php

/**
 * @TODO: Verificar tipo do campo sisbov e nirf
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class FazendaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Fazenda';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$fazendaModel = new Model_Db_Fazenda();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $fazendaModel->getPaginatorAdapter($_by, $_order);

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
		$fields[] = new Model_Grid_Fields('descricao','Descrição', 400);
		$fields[] = new Model_Grid_Fields('cidade','Cidade', 200);
		$fields[] = new Model_Grid_Fields('uf','UF', 35);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'fazenda',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'fazenda',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'fazenda',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function editAction()
	{

		$request		= $this->getRequest();
		$fazendaId		= (int)$request->getParam('id');
		$fazendaForm	= new Form_Fazenda();
		$fazendaForm->setAction('/fazenda/edit');
		$fazendaForm->setMethod('post');
		$fazendaModel = new Model_Db_Fazenda();

		$estadoModel = new Model_Db_Estado();
		$estados = $estadoModel->getEstados();
		$fazendaForm->getElement('uf')
			->addMultiOption(false, '--');
		foreach ($estados as $estado) {
			$fazendaForm->getElement('uf')
				->addMultiOption($estado['id'], $estado['uf']);
		}

		$cidadeModel = new Model_Db_Estado_Cidades();
		if ($this->getRequest()->getParam('uf') != '') {
			$fazendaForm->getElement('cidades_id')
				->addMultiOption(false, '-- Selecione um cidade --');
			$cidades = $cidadeModel->getCidades($this->getRequest()->getParam('uf'));
			foreach ($cidades as $cidade) {
				$fazendaForm->getElement('cidades_id')
					->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
			}
		} else {
			$fazendaForm->getElement('cidades_id')
				->addMultiOption(false, '-- Selecione um estado --');
		}

		if ($request->isPost()) {

			if ($fazendaForm->isValid($request->getPost())) {
				$fazendaModel->updateFazenda($fazendaForm->getValues());
				$this->_redirect('fazenda/index');
			}

		} else {
			if ($fazendaId > 0) {
				$result = $fazendaModel->getFazenda($fazendaId);

				$fazendaForm->getElement('cidades_id')
					->addMultiOption(false, '-- Selecione uma cidade --');
				$cidades = $cidadeModel->getCidades($result['uf']);
				foreach ($cidades as $cidade) {
					$fazendaForm->getElement('cidades_id')
						->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
				}

				$fazendaForm->populate( $result );
			} else {
				throw new Exception("invalid record number.");
			}
		}

		$this->view->elements = array(
			'id',
			'descricao',
			'proprietario',
			'endereco',
			'cidades_id',
			'cpf_cnpj',
			'rg',
			'sisbov',
			'nirf',
			'delete',
		);

		$this->view->form = $fazendaForm;

	}

	public function addAction()
	{

		$fazendaForm = new Form_Fazenda();
		$fazendaForm->setAction('/fazenda/add');
		$fazendaForm->setMethod('post');
		$this->view->form = $fazendaForm;
		$this->view->elements = array(
			'descricao',
			'proprietario',
			'endereco',
			'cidades_id',
			'cpf_cnpj',
			'rg',
			'sisbov',
			'nirf',
		);

		$estadoModel = new Model_Db_Estado();
		$estados = $estadoModel->getEstados();
		$fazendaForm->getElement('uf')
			->addMultiOption(false, '--');
		foreach ($estados as $estado) {
			$fazendaForm->getElement('uf')
				->addMultiOption($estado['id'], $estado['uf']);
		}

		$cidadeModel = new Model_Db_Estado_Cidades();
		if ($this->getRequest()->getParam('uf') != '') {
			$fazendaForm->getElement('cidades_id')
				->addMultiOption(false, '-- Selecione um cidade --');
			$cidades = $cidadeModel->getCidades($this->getRequest()->getParam('uf'));
			foreach ($cidades as $cidade) {
				$fazendaForm->getElement('cidades_id')
					->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
			}
		} else {
			$fazendaForm->getElement('cidades_id')
				->addMultiOption(false, '-- Selecione um estado --');
		}

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($fazendaForm->isValid($formData)) {
				$descricao = $fazendaForm->getValue('descricao');
				$proprietario = $fazendaForm->getValue('proprietario');
				$endereco = $fazendaForm->getValue('endereco');
				$cidades_id = $fazendaForm->getValue('cidades_id');
				$cpf_cnpj = $fazendaForm->getValue('cpf_cnpj');
				$rg = $fazendaForm->getValue('rg');
				$sisbov = $fazendaForm->getValue('sisbov');
				$nirf = $fazendaForm->getValue('nirf');
				$fazendaModel = new Model_Db_Fazenda();
				if ($fazendaModel->addFazenda($descricao, $proprietario, $endereco, $cidades_id, $cpf_cnpj, $rg, $sisbov, $nirf)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				} else {
					die('erro no insert');
				}

			 }
		 }

	}

	public function deleteAction()
	{

		$request		= $this->getRequest();
		$fazendaForm	= new Form_Fazenda();
		$fazendaForm->setAction('/fazenda/delete');
		$fazendaForm->setMethod('post');
		$fazendaModel = new Model_Db_Fazenda();

		if ($request->isPost() && $request->getParam('param', false) == 'fazenda') {
			$fazendaId	= (int)$request->getParam('id');
			$fazendaModel->deleteFazenda($fazendaId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$fazendaId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro ('.$fazendaId.')';
		}
		$this->view->url = 'fazenda/index';

	}

}
