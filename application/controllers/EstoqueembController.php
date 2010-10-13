<?php

/**
 * @package Controller
 */

/**
 * EstoqueembController
 * 
 * Controla estoque de embrioes.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */
class EstoqueembController extends Zend_Controller_Action
{

    public function init()
    {
        $auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Estoque de Embriões';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {

    	$gridModel = new Model_Grid($this->view->title);
    	$estoqueModel = new Model_Db_EstoqueEmbriao();

    	$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');

		$result = $estoqueModel->getPaginatorAdapter($_by, $_order);

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
		$fields[] = new Model_Grid_Fields('data_coleta', 'Data', 70);
		$fields[] = new Model_Grid_Fields('embriao', 'Embrião', 70);
		$fields[] = new Model_Grid_Fields('vaca_cod', 'Doadora (cod)', 75);
		$fields[] = new Model_Grid_Fields('vaca_nome', 'Doadora', 150);
		$fields[] = new Model_Grid_Fields('touro_cod', 'Touro (cod)', 75);
		$fields[] = new Model_Grid_Fields('touro_nome', 'Touro', 150);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'estoqueemb',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'estoqueemb',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'estoqueemb',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
    }

    public function editAction()
    {

    	$request		= $this->getRequest();
    	$estoqueId		= $request->getParam('id');
		$estoqueForm	= new Form_EstoqueEmbriao();

		$estoqueForm->setACtion('/estoqueemb/edit');
		$estoqueForm->setMethod('post');

		// Disable form elements
		$disable_elements = array(
			'embriao',
		);
		foreach ($disable_elements as $el) {
			$estoqueForm->getElement($el)
			->setAttrib('readonly', 'readonly')
			->setAttrib('disable', true)
			->setRequired(false)
			;
		}

		$this->view->form = $estoqueForm;
    	$this->view->elements = array(
    		'id',
    		'embriao',
    		'dt_coleta',
    		array('doadora'),
    		array('touro'),
    		'sexo',
    		array('criador'),
    		'delete',
    	);

    	$estoqueModel = new Model_Db_EstoqueEmbriao();

    	if ($request->isPost()) {

    		if ($estoqueForm->isValid($request->getPost())) {
    			$estoqueModel->updateEstoque($estoqueForm->getValues());
    			$this->_redirect('/'. $this->getRequest()->getControllerName());
    		}

    	} else {
    		if ($estoqueId > 0) {
    			$result = $estoqueModel->getEstoqueEmbriao($estoqueId);
    			$estoqueForm->populate($result);
    		} else {
    			throw new Exception("invalid record number");
    		}
    	}
    }

	public function addAction()
	{

		$estoqueForm = new Form_EstoqueEmbriao();
		$estoqueForm->setAction('/estoqueemb/add');
		$estoqueForm->setMethod('post');
		$this->view->form = $estoqueForm;
		$this->view->elements = array(
			'embriao',
    		'dt_coleta',
    		array('doadora'),
    		array('touro'),
    		'sexo',
    		array('criador'),
		);

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($estoqueForm->isValid($formData)) {
				$estoqueModel = new Model_Db_EstoqueEmbriao();
				if ($estoqueModel->addEstoque($formData)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$estoqueForm->populate($formData);
			}
		}

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$estoqueForm = new Form_EstoqueEmbriao();
		$estoqueForm->setAction('estoqueemb/delete');
		$estoqueForm->setMethod('post');
		$estoqueModel = new Model_Db_EstoqueEmbriao();

		if ($request->isPost() && $request->getParam('param', false) == 'estoqueemb') {
			$estoqueId = (int)$request->getParam('id');
			$estoqueModel->deleteEstoque($estoqueId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$estoqueId = (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$estoqueId.')';
		}

		$this->view->url = 'estoqueemb/index';

	}

}
