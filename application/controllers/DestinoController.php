<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class DestinoController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Destinos';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$destinoModel = new Model_Db_Destino();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $destinoModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'Destino', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'destino',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'destino',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'destino',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$destinoForm = new Form_Destino();
		$destinoForm->setAction('/destino/add');
		$destinoForm->setMethod('post');
		$this->view->form = $destinoForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($destinoForm->isValid($formData)) {
				$cod = $destinoForm->getValue('cod');
				$dsc = $destinoForm->getValue('dsc');
				$destinoModel = new Model_Db_Destino();
				if ($destinoModel->addDestino($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$destinoForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request		= $this->getRequest();
		$destinoId		= (int)$request->getParam('id');
		$destinoForm	= new Form_Destino();
		
		$destinoForm->setAction('/destino/edit');
		$destinoForm->setMethod('post');
		$destinoModel = new Model_Db_Destino();
		$destinoForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($destinoForm->isValid($request->getPost())) {
				$destinoModel->updateDestino($destinoForm->getValues());
				$this->_redirect('destino/index');
			}

		} else {

			if ($destinoId > 0) {
				$result = $destinoModel->getDestino($destinoId);
				$destinoForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc', 'delete');
		$this->view->form = $destinoForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$destinoForm = new Form_Destino();
		$destinoForm->setAction('destino/delete');
		$destinoForm->setMethod('post');
		$destinoModel = new Model_Db_Destino();

		if ($request->isPost() && $request->getParam('param', false) == 'destino') {
			$destinoId	= (int)$request->getParam('id');
			$destinoModel->deleteDestino($destinoId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$destinoId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$destinoId.')';
		}
		$this->view->url = 'destino/index';

	}


}
