<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class SituacaoCriaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Situações das Crias ao Nascimento';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$situacaocriaModel = new Model_Db_SituacaoCria();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $situacaocriaModel->getPaginatorAdapter($_by, $_order);

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
		$fields[] = new Model_Grid_Fields('cod', 'Situação', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'situacaocria',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'situacaocria',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'situacaocria',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$situacaocriaForm = new Form_SituacaoCria();
		$situacaocriaForm->setAction('/situacaocria/add');
		$situacaocriaForm->setMethod('post');
		$this->view->form = $situacaocriaForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($situacaocriaForm->isValid($formData)) {
				$cod = $situacaocriaForm->getValue('cod');
				$dsc = $situacaocriaForm->getValue('dsc');
				$situacaocriaModel = new Model_Db_SituacaoCria();
				if ($situacaocriaModel->addSituacaoCria($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$situacaocriaForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request			= $this->getRequest();
		$situacaocriaId		= (int)$request->getParam('id');
		$situacaocriaForm	= new Form_SituacaoCria();
		
		$situacaocriaForm->setAction('/situacaocria/edit');
		$situacaocriaForm->setMethod('post');
		$situacaocriaModel = new Model_Db_SituacaoCria();
		$situacaocriaForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($situacaocriaForm->isValid($request->getPost())) {
				$situacaocriaModel->updateSituacaoCria($situacaocriaForm->getValues());
				$this->_redirect('situacaocria/index');
			}

		} else {

			if ($situacaocriaId > 0) {
				$result = $situacaocriaModel->getSituacaoCria($situacaocriaId);
				$situacaocriaForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc', 'delete');
		$this->view->form = $situacaocriaForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$situacaocriaForm = new Form_SituacaoCria();
		$situacaocriaForm->setAction('situacaocria/delete');
		$situacaocriaForm->setMethod('post');
		$situacaocriaModel = new Model_Db_SituacaoCria();

		if ($request->isPost() && $request->getParam('param', false) == 'situacaocria') {
			$situacaocriaId	= (int)$request->getParam('id');
			$situacaocriaModel->deleteSituacaoCria($situacaocriaId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$situacaocriaId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$situacaocriaId.')';
		}
		$this->view->url = 'situacaocria/index';

	}

}
