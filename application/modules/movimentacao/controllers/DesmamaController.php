<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Movimentacao_DesmamaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Movimentação :: Desmana';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$movimentacaoModel = new Model_Db_Movimentacao();
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
		$fields[] = new Model_Grid_Fields('old', 'Antigo', 200);
		$fields[] = new Model_Grid_Fields('new', 'Novo', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'movimentacao/desmama',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'movimentacao/desmama',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'movimentacao/desmama',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{
		throw new Zend_Controller_Action_Exception('Funcionalidade não implementada.');
	}

}
