<?php
/**
 * @package Controller
 */

/**
 * SituacaoController
 * 
 * Controla requisições de manipulação de situações de pesagem.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class SituacaoPesagemController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Tipos de Situacao à Pesagem';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$situacaopesagemModel = new Model_Db_SituacaoPesagem();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $situacaopesagemModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'SituacaoPesagem', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'situacaopesagem',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'situacaopesagem',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'situacaopesagem',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$situacaopesagemForm = new Form_SituacaoPesagem();
		$situacaopesagemForm->setAction('/situacaopesagem/add');
		$situacaopesagemForm->setMethod('post');
		$this->view->form = $situacaopesagemForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($situacaopesagemForm->isValid($formData)) {
				$cod = $situacaopesagemForm->getValue('cod');
				$dsc = $situacaopesagemForm->getValue('dsc');
				$situacaopesagemModel = new Model_Db_SituacaoPesagem();
				if ($situacaopesagemModel->addSituacaoPesagem($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$situacaopesagemForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request				= $this->getRequest();
		$situacaopesagemId		= (int)$request->getParam('id');
		$situacaopesagemForm	= new Form_SituacaoPesagem();
		
		$situacaopesagemForm->setAction('/situacaopesagem/edit');
		$situacaopesagemForm->setMethod('post');
		$situacaopesagemModel = new Model_Db_SituacaoPesagem();
		$situacaopesagemForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($situacaopesagemForm->isValid($request->getPost())) {
				$situacaopesagemModel->updateSituacaoPesagem($situacaopesagemForm->getValues());
				$this->_redirect('/'. $this->getRequest()->getControllerName());
			}

		} else {

			if ($situacaopesagemId > 0) {
				$result = $situacaopesagemModel->getSituacaoPesagem($situacaopesagemId);
				$situacaopesagemForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc', 'delete');
		$this->view->form = $situacaopesagemForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$situacaopesagemForm = new Form_SituacaoPesagem();
		$situacaopesagemForm->setAction('situacaopesagem/delete');
		$situacaopesagemForm->setMethod('post');
		$situacaopesagemModel = new Model_Db_SituacaoPesagem();

		if ($request->isPost() && $request->getParam('param', false) == 'situacaopesagem') {
			$situacaopesagemId	= (int)$request->getParam('id');
			$situacaopesagemModel->deleteSituacaoPesagem($situacaopesagemId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$situacaopesagemId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$situacaopesagemId.')';
		}
		$this->view->url = 'situacaopesagem/index';

	}

}
