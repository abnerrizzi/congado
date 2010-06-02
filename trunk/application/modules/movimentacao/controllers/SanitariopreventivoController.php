<?php

/**
 * @TODO: a data de proximo pode ser a mesma quando esta se cadastrando um grupo?
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: CategoriaController.php 203 2010-04-13 14:22:30Z bacteria_ $
 * 
 */

class Movimentacao_SanitariopreventivoController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Controle Sanitários - Preventivo';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$sanitarioModel = new Model_Db_Sanitario();
		$sanitarioModel->setTipo(2);

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $sanitarioModel->getPaginatorAdapter($_by, $_order, array('id', 'data'));
		
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
		$fields[] = new Model_Grid_Fields('dt', 'Data', 20);
		$fields[] = new Model_Grid_Fields('nome', 'Animal', 150);
		$fields[] = new Model_Grid_Fields('doenca', 'Ocorrência', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'movimentacao/sanitariopreventivo',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'movimentacao/sanitariopreventivo',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'movimentacao/sanitariopreventivo',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{

		$morteForm = new Form_Sanitario();
		$morteForm->setName('controle_sanitario_-_preventivo');
		$morteForm->setAction('/movimentacao/sanitariopreventivo/add');
		$morteForm->setMethod('post');

		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$morteForm->getElement('fazenda_id')
			->addMultiOption(false, '--');

		foreach ($fazendas as $fazenda) {
			$morteForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

		$morteForm->getElement('fichario')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$morteForm->getElement('ocorrencia_id')
			->setRequired(true);
		$morteForm->getElement('ocorrencia')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
		;

		$morteForm->getElement('data')
			->setLabel('Data');
		$morteForm->getElement('dataproximo')
			->setRequired(false);

		/*
		 * Procedimento de validacao e inclusao
		 */
		$morteForm->getElement('sequencia_id')->setValue(3);
		$this->view->form = $morteForm;
		$this->view->elements = array(
			'fazenda_id',
			'data',
			array('ocorrencia'),
		);

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($morteForm->isValid($formData)) {
				$cod = $morteForm->getValue('cod');
				$dsc = $morteForm->getValue('dsc');
				$morteModel = new Model_Db_Sanitario();
				$morteModel->setTipo(2);

				// Criar array associando os ids com o restante dos dados.
				$data['fazenda_id']		= $formData['fazenda_id'];
				$data['data']			= $formData['data'];
				$data['ocorrencia_id']	= $formData['ocorrencia_id'];
				$ficharios				= $formData['fichario_id'];

				if ($morteModel->addSanitarioPreventivo($data, $ficharios)) {
					$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
				}
			} else {
				Zend_Debug::dump($morteForm->getErrors());
				die();
				
				if ($this->getRequest()->getParam('fichario_id', '') != '') {
					$horario = $this->getRequest()->getParam('fichario_id', false);
					$ficharioModel = new Model_Db_Fichario();
					foreach ($horario as $key => $val) {
						$animais[] = $ficharioModel->recoverPreventivoMorte($key, $val);
					}
					$this->view->animais = $animais;
				}
				$morteForm->populate($formData);
			}
		}
	}

	public function editAction()
	{
		$request = $this->getRequest();
		$morteId = (int)$request->getParam('id');
		$morteForm = new Form_Sanitario();

		$morteForm->setName('controle_sanitario_-_preventivo');
		$morteForm->setAction('/movimentacao/sanitariopreventivo/edit');
		$morteForm->setMethod('post');

		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$morteForm->getElement('fazenda_id')
			->addMultiOption(false, '--');

		foreach ($fazendas as $fazenda) {
			$morteForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}
		$morteForm->getElement('sequencia_id')->setValue(3);

		$morteForm->getElement('fazenda_id')
			->setAttrib('class', 'readonly')
			;

		$morteForm->getElement('fichario')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		$morteForm->getElement('fichario_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		$morteForm->getElement('ocorrencia')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->setAttrib('size', '40')
			;

		$morteForm->getElement('dataproximo')
			->setRequired(false)
		;
		if ($request->isPost()) {

			$data['id'] = $request->getParam('id');
			$data['data'] = $request->getParam('data');
			$data['ocorrencia_id'] = $request->getParam('ocorrencia_id');
			$data['comentario'] = $request->getParam('comentario');
			$data['dataproximo'] = $request->getParam('dataproximo');
			if ($morteForm->isValid($request->getPost())) {
				$morteModel = new Model_Db_Sanitario();
				$morteModel->updateMorte($data);
				$this->_redirect($request->getModuleName().'/'.$request->getControllerName());
			}
		} else {

			if ($morteId > 0) {
				$morteModel = new Model_Db_Sanitario();
				$morteModel->setTipo(2);
				$result = $morteModel->getSanitario($morteId);
				$morteForm->populate($result);
			} else {
				throw new Exception('invalid record number');
			}
		}

		$this->view->form = $morteForm;
		$this->view->elements = array(
			'id',
			'fazenda_id',
			'data',
			array('ocorrencia'),
			array('fichario'),
			'comentario',
			'dataproximo',
		);
	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$morteForm = new Form_Sanitario();
		$morteForm->setAction('xxx');
		$morteForm->setMethod('post');
		$morteModel = new Model_Db_Sanitario();
		$morteModel->setTipo(2);

		if ($request->isPost() && $request->getParam('param', false) == 'sanitariopreventivo') {
			$morteId = (int)$request->getParam('id');
			$morteModel->deleteMorte($morteId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$morteId = (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$morteId.')';
		}
		$this->view->url = $request->getModuleName().'/'.$request->getControllerName();

	}

}
