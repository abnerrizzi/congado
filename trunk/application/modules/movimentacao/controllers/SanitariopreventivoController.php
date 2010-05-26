<?php

/**
 * 
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
		$movimentacaoModel = new Model_Db_Sanitario();
		$movimentacaoModel->setTipo(2);

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $movimentacaoModel->getPaginatorAdapter($_by, $_order, array('id', 'data'));
		
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
		$fields[] = new Model_Grid_Fields('data', 'Data', 20);
		$fields[] = new Model_Grid_Fields('nome', 'Animal', 150);
		$fields[] = new Model_Grid_Fields('doenca', 'Ocorrência', 200);
		$fields[] = new Model_Grid_Fields('old', 'Destino', 200);

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

		// Valor setado apenas para teste.
		$morteForm->getElement('fazenda_id')->setValue(1);

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
			->setLabel('Data')
			;

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
				print '<pre>';
				die('isValid');
				$cod = $morteForm->getValue('cod');
				$dsc = $morteForm->getValue('dsc');
				$morteModel = new Model_Db_Sanitario();
				$morteModel->setTipo(2);
				if ($morteModel->addSanitarioPreventivo($this->getRequest()->getParams())) {
					$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
				}
			} else {
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

}

