<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: ExamerepController.php 492 2010-10-18 19:47:09Z bacteria_ $
 * 
 */

class Reproducao_ExamerepController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Reprodução :: Acompanhamento Reprodutivo';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$exameModel = new Model_Db_Examerep();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $exameModel->getPaginatorAdapter($_by, $_order, array('id', 'data'));
		
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
		$fields[] = new Model_Grid_Fields('nome', 'Animal', 200);
		$fields[] = new Model_Grid_Fields('acompanhamento', 'Acompanhamento', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> $this->getRequest()->getModuleName().'/examerep',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> $this->getRequest()->getModuleName().'/examerep',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> $this->getRequest()->getModuleName().'/examerep',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{
		$exameForm = new Form_ExameReprodutivo();
		$__action = 	($this->getRequest()->getBaseUrl())
				. '/' .	($this->getRequest()->getModuleName())
				. '/' .	($this->getRequest()->getControllerName())
				. '/' . 'add';
		$exameForm->setAction($__action);
		$exameForm->setMethod('post');
		$this->view->form = $exameForm;

		$this->view->elements = array(
			'id',
			array('fazenda_id'),
			array('fichario'),
			'data',
			array('acompanhamento'),
			'obs',
		);

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($exameForm->isValid($formData))
			{

				// buscar fazenda pelo animal
				$ficharioModel = new Model_Db_Fichario();
				$__fazenda = $ficharioModel->getFichario($exameForm->getValue('fichario_id'));

				$__fichario = $exameForm->getValue('fichario_id');
				$__data = $exameForm->getValue('data');
				$__acompanhamento = $exameForm->getValue('acompanhamento_id');
				$__obs = $exameForm->getValue('obs');

				$exameModel = new Model_Db_Examerep();
				if ($exameModel->addExame($__fazenda, $__fichario, $__data, $__acompanhamento, $__obs)) {
					$this->_redirect('/'.$this->getRequest()->getModuleName() .'/'. $this->getRequest()->getControllerName());
				}
				throw new Zend_Controller_Action_Exception('Implementar validacao dos dados');
			} else {
				$exameForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request			= $this->getRequest();
		$exameId			= (int)$request->getParam('id');
		$exameForm			= new Form_ExameReprodutivo();

		$__action = 	($this->getRequest()->getBaseUrl())
				. '/' .	($this->getRequest()->getModuleName())
				. '/' .	($this->getRequest()->getControllerName())
				. '/' . 'edit';
		$exameForm->setAction($__action);
		$exameForm->setMethod('post');
		$exameModel = new Model_Db_Examerep();

		$exameForm->getElement('data')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		$exameForm->getElement('fichario_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		$exameForm->getElement('acompanhamento_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;

		if ($request->isPost()) {

			if ($exameForm->isValid($request->getPost())) {
				$exameModel->updateExame($exameForm->getValues());
				$this->_redirect('/'.$this->getRequest()->getModuleName() .'/'. $this->getRequest()->getControllerName());
			}
			
		} else {
			if ($exameId > 0) {
				$result = $exameModel->getExame($exameId);
				$exameForm->populate($result);
			} else {
				throw new Zend_Controller_Action_Exception('invalid record number');
			}
		}

		$this->view->elements = array(
			array('fichario'),
			'data',
			array('acompanhamento'),
			'obs',
			'delete',
		);

		$this->view->form = $exameForm;
	}

	public function deleteAction()
	{
		$request 	= $this->getRequest();
		$exameModel	= new Model_Db_Examerep();

		if ($request->isPost() && $request->getParam('param', false) == 'reproducao/examerep') {
			$exameId	= (int)$request->getParam('id');
			$exameModel->deleteExame($exameId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$exameId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$exameId.')';
		}
		$this->view->url =
			Zend_Controller_Front::getInstance()->getRequest()->getModuleName() .'/'.
			Zend_Controller_Front::getInstance()->getRequest()->getControllerName();
	}

}
