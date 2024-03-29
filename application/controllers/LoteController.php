<?php

/**
 * @package Controller
 */

/**
 * LoteController
 * 
 * Controla requisições de manipulação de lotes.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class LoteController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Lotes';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$loteModel = new Model_Db_Lote();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $loteModel->getPaginatorAdapter($_by, $_order);

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
		$fields[] = new Model_Grid_Fields('cod', 'Lote', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'lote',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'lote',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'lote',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$loteForm = new Form_Lote();
		$loteForm->setAction('/lote/add');
		$loteForm->setMethod('post');
		$this->view->form = $loteForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();

			if ($loteForm->isValid($formData)) {
				$loteForm->getElement('cod')->addValidator(
					new Zend_Validate_Db_NoRecordExists(
						'lote',
						'cod'
					)
				);
			}

			if ($loteForm->isValid($formData)) {
				$cod = $loteForm->getValue('cod');
				$dsc = $loteForm->getValue('dsc');
				$loteModel = new Model_Db_Lote();
				if ($loteModel->addLote($cod, $dsc)) {
					$this->_redirect('/'.$this->getRequest()->getControllerName());
				} else {
					die('erro no insert');
				}
			}
		}
	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$loteId		= (int)$request->getParam('id');
		$loteForm	= new Form_Lote();
		$loteForm->setAction('/lote/edit');
		$loteForm->setMethod('post');
		$loteModel = new Model_Db_Lote();
		$loteForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		if ($request->isPost()) {

			if ($loteForm->isValid($request->getPost())) {
				$loteModel->updateLote($loteForm->getValues());
				$this->_redirect('/'. $this->getRequest()->getControllerName());
			}

		} else {

			if ($loteId > 0) {
				$result = $loteModel->getLote($loteId);
				$loteForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id', 'cod', 'dsc', 'delete');
		$this->view->form = $loteForm;
	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$loteForm = new Form_Lote();
		$loteForm->setAction('lote/delete');
		$loteForm->setMethod('post');
		$loteModel = new Model_Db_Lote();

		if ($request->isPost() && $request->getParam('param', false) == 'lote') {
			$loteId	= (int)$request->getParam('id');
			$loteModel->deleteLote($loteId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$loteId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$loteId.')';
		}
		$this->view->url = 'lote/index';

	}

}
