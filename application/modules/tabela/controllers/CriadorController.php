<?php

/**
 * @package Controller
 */

/**
 * CriadorController
 * 
 * Controla requisições de manipulação dos criadores.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id: CriadorController.php 595 2011-01-13 17:01:24Z bacteria_ $
 */
class Tabela_CriadorController extends Plugin_DefaultController
{

	public function init()
	{
		$this->view->title = 'Tabela :: Criadores / Proprietários / Compradores';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$criadorModel = new Model_Db_Criador();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $criadorModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'C&oacute;digo', 20);
		$fields[] = new Model_Grid_Fields('dsc', 'Descri&ccedil;&atilde;o', 250);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'tabela/criador',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'tabela/criador',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'tabela/criador',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;

	}

	public function editAction()
	{

		$request		= $this->getRequest();
		$criadorId		= (int)$request->getParam('id');
		$criadorForm	= new Form_Criador();
		$criadorForm->setAction('/tabela/criador/edit');
		$criadorForm->setMethod('post');
		$criadorForm->getElement('cod')->removeValidator('NoRecordExists');
		$criadorModel = new Model_Db_Criador();
		$criadorForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$estadoModel = new Model_Db_Estado();
		$estados = $estadoModel->getEstados();
		$criadorForm->getElement('uf')
			->addMultiOption(false, '--');
		$criadorForm->getElement('corresp_uf')
			->addMultiOption(false, '--');
		foreach ($estados as $estado) {
			$criadorForm->getElement('uf')
				->addMultiOption($estado['id'], $estado['uf']);
			$criadorForm->getElement('corresp_uf')
				->addMultiOption($estado['id'], $estado['uf']);
		}

		$cidadeModel = new Model_Db_Estado_Cidades();
		if ($this->getRequest()->getParam('uf') != '') {
			$criadorForm->getElement('cidades_id')
				->addMultiOption(false, '-- Selecione um cidade --');
			$cidades = $cidadeModel->getCidades($this->getRequest()->getParam('uf'));
			foreach ($cidades as $cidade) {
				$criadorForm->getElement('cidades_id')
					->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
			}
		} else {
			$criadorForm->getElement('cidades_id')
				->addMultiOption(false, '-- Selecione um estado --');
		}

		if ($this->getRequest()->getParam('corresp_uf') != '') {
			$criadorForm->getElement('corresp_cidades_id')
				->addMultiOption(false, '-- Selecione um cidade --');
			$cidades = $cidadeModel->getCidades($this->getRequest()->getParam('corresp_uf'));
			foreach ($cidades as $cidade) {
				$criadorForm->getElement('corresp_cidades_id')
					->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
			}
		} else {
			$criadorForm->getElement('corresp_cidades_id')
				->addMultiOption(false, '-- Selecione um estado --');
		}

		if ($request->isPost()) {

			if ($criadorForm->isValid($request->getPost())) {

				$criadorModel->updateCriador($criadorForm->getValues());
				$this->_redirect('/'. $this->getRequest()->getControllerName());

			}

		} else {
			if ($criadorId > 0) {
				$result = $criadorModel->getCriador($criadorId);

				if ($result['cidades_id'] == "") {
					$criadorForm->getElement('cidades_id')
						->addMultiOption(false, '-- Selecione um estado --');
				} else {
					$cidades = $cidadeModel->getCidades($result['uf']);
					foreach ($cidades as $cidade) {
						$criadorForm->getElement('cidades_id')
							->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
					}
				}

				if ($result['corresp_cidades_id'] == "") {
					$criadorForm->getElement('corresp_cidades_id')
						->addMultiOption(false, '-- Selecione um estado --');
				} else {
					$cidades = $cidadeModel->getCidades($result['corresp_uf']);
					foreach ($cidades as $cidade) {
						$criadorForm->getElement('corresp_cidades_id')
							->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
					}
				}

				$criadorForm->populate( $result );

			}
		}

		$this->view->elements = array(
			'id',
			'cod',
			'dsc',
			'email',
			'telefone',
			'celular',
			'cpf_cnpj',
			'rg',
			'fazenda',
			'cidades_id',
			'corresp_endereco',
			'corresp_cidades_id',
			'corresp_cep',
			'delete',
		);

		$this->view->form = $criadorForm;
	}

	public function addAction()
	{
		
		$criadorForm = new Form_Criador();
		$criadorForm->setAction('/tabela/criador/add');
		$criadorForm->setMethod('post');
		$this->view->form = $criadorForm;
		$this->view->elements = array(
			'cod',
			'dsc',
			'email',
			'telefone',
			'celular',
			'cpf_cnpj',
			'rg',
			'fazenda',
			'cidades_id',
			'corresp_endereco',
			'corresp_cidades_id',
			'corresp_cep',
		);

		$estadoModel = new Model_Db_Estado();
		$estados = $estadoModel->getEstados();
		$criadorForm->getElement('uf')
			->addMultiOption(false, '--');
		$criadorForm->getElement('corresp_uf')
			->addMultiOption(false, '--');
		foreach ($estados as $estado) {
			$criadorForm->getElement('uf')
				->addMultiOption($estado['id'], $estado['uf']);
			$criadorForm->getElement('corresp_uf')
				->addMultiOption($estado['id'], $estado['uf']);
		}

		$cidadeModel = new Model_Db_Estado_Cidades();
		if ($this->getRequest()->getParam('uf') != '') {
			$criadorForm->getElement('cidades_id')
				->addMultiOption(false, '-- Selecione um cidade --');
			$cidades = $cidadeModel->getCidades($this->getRequest()->getParam('uf'));
			foreach ($cidades as $cidade) {
				$criadorForm->getElement('cidades_id')
					->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
			}
		} else {
			$criadorForm->getElement('cidades_id')
				->addMultiOption(false, '-- Selecione um estado --');
		}

		if ($this->getRequest()->getParam('corresp_uf') != '') {
			$criadorForm->getElement('corresp_cidades_id')
				->addMultiOption(false, '-- Selecione um cidade --');
			$cidades = $cidadeModel->getCidades($this->getRequest()->getParam('corresp_uf'));
			foreach ($cidades as $cidade) {
				$criadorForm->getElement('corresp_cidades_id')
					->addMultiOption($cidade['id'], utf8_decode($cidade['nome']));
			}
		} else {
			$criadorForm->getElement('corresp_cidades_id')
				->addMultiOption(false, '-- Selecione um estado --');
		}
		


		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($criadorForm->isValid($formData)) {
				$cod = $criadorForm->getValue('cod');
				$dsc = $criadorForm->getValue('dsc');
				$cpf_cnpj = $criadorForm->getValue('cpf_cnpj');
				$rg = $criadorForm->getValue('rg');
				$cidades_id = $criadorForm->getValue('cidades_id');
				$corresp_endereco = $criadorForm->getValue('corresp_endereco');
				$corresp_cidades_id = $criadorForm->getValue('corresp_cidades_id');
				$corresp_cep = $criadorForm->getValue('corresp_cep');
				$telefone = $criadorForm->getValue('telefone');
				$celular = $criadorForm->getValue('celular');
				$email = $criadorForm->getValue('email');
				$criadorModel = new Model_Db_Criador();
				if ($criadorModel->addCriador(
					$cod, $dsc, $cpf_cnpj, $rg, $cidades_id, $corresp_endereco,
					$corresp_cidades_id, $corresp_cep, $telefone, $celular, $email)) {
						$this->_redirect('/'. $this->getRequest()->getControllerName());
					} else {
						die('erro no insert');
					}
			} else {
				$criadorForm->populate($formData);
			}
		}
		
	}

	public function deleteAction()
	{

		$request		= $this->getRequest();
		$criadorForm	= new Form_Criador();
		$criadorForm->setAction('/tabela/criador/delete');
		$criadorForm->setMethod('post');
		$criadorModel = new Model_Db_Criador();

		if ($request->isPost() && $request->getParam('param', false) == 'criador') {
			$criadorId = (int)$request->getParam('id');
			$criadorModel->deleteCriador($criadorId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$fazendaId = (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$criadorId.')';
		}
		$this->view->url = 'tabela/criador/index';
	}

}
