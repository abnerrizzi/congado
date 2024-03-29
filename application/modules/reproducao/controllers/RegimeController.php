<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Reproducao_RegimeController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Reprodu��o :: Regime de Pasto';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$regimeModel = new Model_Db_Cobertura();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $regimeModel->getPaginatorAdapterRegime($_by, $_order);

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
		$fields[] = new Model_Grid_Fields('dhi', 'Periodo Inicial', 1);
		$fields[] = new Model_Grid_Fields('dhf', 'Periodo Final', 1);
		$fields[] = new Model_Grid_Fields('touro', 'Touro', 80);
		$fields[] = new Model_Grid_Fields('numerocobertura', 'Conertura N�', 1);
		$fields[] = new Model_Grid_Fields('vaca_fazenda_id', 'Fazenda', 1);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'reproducao/regime',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'reproducao/regime',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'reproducao/regime',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{
		throw new Zend_Controller_Action_Exception('Funcionalidade n�o implementada.');
	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$regimeId	= (int)$request->getParam('id');
		$regimeForm	= new Form_Cobertura();
		$regimeForm->setName('regime_de_pasto');
		$regimeForm->removeElement('tipo');
		$regimeForm->addElement('text', 'tipo', array(
			'label' => 'Tipo da Cobertura',
			'class'	=> 'input',
		));

		$__action = 	($this->getRequest()->getBaseUrl())
				. '/' .	($this->getRequest()->getModuleName())
				. '/' .	($this->getRequest()->getControllerName())
				. '/' . 'edit';

		$regimeForm->setAction($__action);
		$regimeForm->setMethod('post');
		$regimeModel = new Model_Db_Cobertura();

		/*
		 * Populando select de fazendas
		 */
		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		foreach ($fazendas as $fazenda) {
			$regimeForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

		$regimeForm->getElement('dt_cobertura')->setLabel('Per�odo Inicial');
		$regimeForm->getElement('dataCio')->setLabel('Per�odo Final');
		// Read Only form elements
		$readonly_elements = array(
			'vaca',
			'vaca_cod',
			'dt_cobertura',
			'dataCio',
			'inseminador',
			'touro',
			'lote',
			'ultima_tipo',
			'tipo',
		);
		if (count($readonly_elements) > 0) {
			foreach ($readonly_elements as $el) {
				$regimeForm->getElement($el)
				->setAttrib('readonly', 'readonly')
				->setAttrib('class', 'readonly');
			}
		}
		// Disabled form elements
		$disabled_elements = array(
			'fazenda_id',
			'ultima_tipo',
		);
		if (count($disabled_elements) > 0) {
			foreach ($disabled_elements as $el)
			{
				$regimeForm->getElement($el)
				->setAttrib('disabled', 'disabled');
			}
		}

		$this->view->elements = array(
			'id',
			'fazenda_id',
			array('vaca'),
			'dt_cobertura',
			'dataCio',
			'tipo',
			'numerocobertura',
			'ultima_cobertura',
			'ultima_tipo',
			array('touro'),
			array('lote'),
			'delete',
		);
		if ($request->isPost()) {

			$regimeForm->getElement('fazenda_id')->setRequired(false);
			$regimeForm->getElement('inseminador_id')->setRequired(false);

			if ($regimeForm->isValid($request->getPost())) {
				$formValues = $regimeForm->getValues(true);
				$values = array(
					'id'		=> $regimeForm->getValue('id'), 
					'touro_id'	=> $regimeForm->getValue('touro_id'),
					'lote_id'	=> $regimeForm->getValue('lote_id'),
				);
				$regimeModel->updateRegime($values);
				$this->_redirect('/'. $this->getRequest()->getModuleName() . '/'. $this->getRequest()->getControllerName());
			}
		} else {

			if ($regimeId > 0) {
				$result = $regimeModel->getRegime($regimeId);
				$regimeForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->form = $regimeForm;

	}

	private function _populateTipos($coberturaForm)
	{
		$coberturaForm->getElement('tipo')
			->addMultiOption(false, '--');

		$tipoModel = new Model_Db_CoberturaTipo();
		$tipos = $tipoModel->getTipos();
		$coberturaForm->getElement('tipo')
			->addMultiOption(false, '--');
		foreach ($tipos as $tipo) {
			$coberturaForm->getElement('tipo')
				->addMultiOption($tipo['cod'], $tipo['dsc']);
			$coberturaForm->getElement('ultima_tipo')
				->addMultiOption($tipo['cod'], $tipo['dsc']);
		}
	}
}
