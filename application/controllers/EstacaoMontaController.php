<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class EstacaoMontaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Estações de Monta';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$estacaomontaModel = new Model_Db_EstacaoMonta();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $estacaomontaModel->getPaginatorAdapter($_by, $_order);

		/*
		 * Paginator
		 */
		$paginator = Zend_Paginator::factory($result);
		$paginator->setItemCountPerPage(Zend_Registry::get('configuration')->pagination->itemCoutPerPage);
		$paginator->setCurrentPageNumber($_page);

		/*
		 * Fields
		 */
		$fields[] = new Model_Grid_Fields('cod', 'EstacaoMonta', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);
		$fields[] = new Model_Grid_Fields('dt_inicio','Data Início', 75);
		$fields[] = new Model_Grid_Fields('dt_fim','Data Fim', 75);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'estacaomonta',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'estacaomonta',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'estacaomonta',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$estacaomontaForm = new Form_EstacaoMonta();
		$estacaomontaForm->setAction('/estacaomonta/add');
		$estacaomontaForm->setMethod('post');
		$this->view->form = $estacaomontaForm;
		$this->view->elements = array('cod', 'dsc', 'dt_inicio', 'dt_fim');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($estacaomontaForm->isValid($formData)) {
				$cod = $estacaomontaForm->getValue('cod');
				$dsc = $estacaomontaForm->getValue('dsc');
				$dt_inicio = $estacaomontaForm->getValue('dt_inicio');
				$dt_fim = $estacaomontaForm->getValue('dt_fim');
				$estacaomontaModel = new Model_Db_EstacaoMonta();
				if ($estacaomontaModel->addEstacaoMonta($cod, $dsc, $dt_inicio, $dt_fim)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$estacaomontaForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request			= $this->getRequest();
		$estacaomontaId		= (int)$request->getParam('id');
		$estacaomontaForm	= new Form_EstacaoMonta();
		
		$estacaomontaForm->setAction('/estacaomonta/edit');
		$estacaomontaForm->setMethod('post');
		$estacaomontaModel = new Model_Db_EstacaoMonta();
		$estacaomontaForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($estacaomontaForm->isValid($request->getPost())) {
				$estacaomontaModel->updateEstacaoMonta($estacaomontaForm->getValues());
				$this->_redirect('estacaomonta/index');
			}

		} else {

			if ($estacaomontaId > 0) {
				$result = $estacaomontaModel->getEstacaoMonta($estacaomontaId);
				$estacaomontaForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc', 'dt_inicio', 'dt_fim');
		$this->view->form = $estacaomontaForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$estacaomontaForm = new Form_EstacaoMonta();
		$estacaomontaForm->setAction('estacaomonta/delete');
		$estacaomontaForm->setMethod('post');
		$estacaomontaModel = new Model_Db_EstacaoMonta();

		if ($request->isPost() && $request->getParam('param', false) == 'estacaomonta') {
			$estacaomontaId	= (int)$request->getParam('id');
			$estacaomontaModel->deleteEstacaoMonta($estacaomontaId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$estacaomontaId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$estacaomontaId.')';
		}
		$this->view->url = 'estacaomonta/index';

	}


}
