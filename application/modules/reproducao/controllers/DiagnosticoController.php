<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: CoberturaController.php 521 2010-11-16 17:17:32Z bacteria_ $
 * 
 */

class Reproducao_DiagnosticoController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Reprodu��o :: Diagn�stico de Gesta��o';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$coberturaModel = new Model_Db_Cobertura();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $coberturaModel->getPaginatorAdapter($_by, $_order);
		
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
		$fields[] = new Model_Grid_Fields('vaca', 'Vaca', 80);
		$fields[] = new Model_Grid_Fields('dh', 'Data Cobertura', 100);
		$fields[] = new Model_Grid_Fields('tipo', 'Tipo', 1);
		$fields[] = new Model_Grid_Fields('touro', 'Touro', 70);
		$fields[] = new Model_Grid_Fields('inseminador', 'Inseminador', 90);
		$fields[] = new Model_Grid_Fields('lote_dsc', 'Lote', 120);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'reproducao/cobertura',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'reproducao/cobertura',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'reproducao/cobertura',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
	}

	public function _addAction()
	{
		throw new Zend_Controller_Action_Exception('Funcionalidade ainda n�o implementada.');
	}

	public function _editAction()
	{

		$request	= $this->getRequest();
		$coberturaId	= (int)$request->getParam('id');
		$coberturaForm	= new Form_Cobertura();

		$__action = 	($this->getRequest()->getBaseUrl())
				. '/' .	($this->getRequest()->getModuleName())
				. '/' .	($this->getRequest()->getControllerName())
				. '/' . 'edit';

		$coberturaForm->setAction($__action);
		$coberturaForm->setMethod('post');
		$coberturaModel = new Model_Db_Cobertura();

		$this->populateTipos($coberturaForm);
		/*
		 * Populando select de fazendas
		 */
		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$coberturaForm->getElement('fazenda_id')
			->addMultiOption(false, '--')
		;
		foreach ($fazendas as $fazenda) {
			$coberturaForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

		if ($request->isPost()) {
				throw new Zend_Exception('Implementar validacao e alteracao do registro');

//			if ($doencaForm->isValid($request->getPost())) {
//				$values = $doencaForm->getValues(true);
//				unset($values['submit'], $values['cancel'], $values['delete']);
//				$doencaModel->updateDoenca($values);
//				$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
//			}

		} else {

			if ($coberturaId > 0) {
				$result = $coberturaModel->getCobertura($coberturaId);
				$coberturaForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		// Read Only form elements
		$readonly_elements = array(
			'vaca',
			'vaca_cod',
			'dt_cobertura',
			'tipo',
			'touro',
			'inseminador',
			'lote',
			'ultima_tipo',
		);
		if (count($readonly_elements) > 0) {
			foreach ($readonly_elements as $el) {
				$coberturaForm->getElement($el)
				->setAttrib('readonly', 'readonly')
				->setAttrib('class', 'readonly');
			}
		}
		// Disabled form elements
		$disabled_elements = array(
			'fazenda_id',
			'ultima_tipo',
			'tipo',
		);
		if (count($disabled_elements) > 0) {
			foreach ($disabled_elements as $el)
			{
				$coberturaForm->getElement($el)
				->setAttrib('disabled', 'disabled');
			}
		}

		$this->view->elements = array(
			'id',
			'fazenda_id',
			array('vaca'),
			'dt_cobertura',
			'tipo',
			'numerocobertura',
			'ultima_cobertura',
			'ultima_tipo',
			array('touro'),
			array('inseminador'),
			array('lote'),
			'delete',
		);
		$this->view->form = $coberturaForm;

	}

}
