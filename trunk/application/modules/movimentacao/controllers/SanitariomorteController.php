<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: CategoriaController.php 203 2010-04-13 14:22:30Z bacteria_ $
 * 
 */

class Movimentacao_SanitariomorteController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Controle Sanitários - Morte';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$movimentacaoModel = new Model_Db_Sanitario();
		$movimentacaoModel->setTipo(0);

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
		$fields[] = new Model_Grid_Fields('doenca', 'Ocorrência', 150);
		$fields[] = new Model_Grid_Fields('old', 'Causa', 250);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'movimentacao/sanitariomorte',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'movimentacao/sanitariomorte',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'movimentacao/sanitariomorte',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{
		throw new Zend_Controller_Action_Exception('Controlador não implementado');
	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$morteId	= (int)$request->getParam('id');
		$morteForm	= new Form_Sanitario();

		$morteForm->setName('controle_sanitario_-_morte');
		$morteForm->setAction('/raca/edit');
		$morteForm->setMethod('post');
		$morteModel = new Model_Db_Sanitario();
		$morteModel->setTipo(0);
		$morteForm->getElement('animal')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($morteForm->isValid($request->getPost())) {
				$values = $morteForm->getValues(true);
				unset($values['submit'], $values['cancel'], $values['delete']);
				$morteModel->updateRaca($values);
				$this->_redirect('raca/index');
			}

		} else {

			if ($morteId > 0) {
				$result = $morteModel->getSanitario($morteId);
				Zend_Debug::dump($result);
				$morteForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array(
			'id',
			'animal',
			'data',
			'ocorrencia_id',
			'ocorrencia_cod',
			'ocorrencia',
			'dsc',
			'comentario',
			'tiposisbov',
			'delete',
		);
		$this->view->form = $morteForm;
	}

}

