<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: CoberturaController.php 457 2010-10-06 14:35:29Z bacteria_ $
 * 
 */

class Reproducao_CoberturaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Reproducao - Cobertura';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$coberturaModel = new Model_Db_Cobertura();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $coberturaModel->getPaginatorAdapter($_by, $_order);
		
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
		$fields[] = new Model_Grid_Fields('dh', 'Data Cobertura', 100);
		$fields[] = new Model_Grid_Fields('touro', 'Touro', 80);
		$fields[] = new Model_Grid_Fields('inseminador', 'Inseminador', 120);
		$fields[] = new Model_Grid_Fields('lote_dsc', 'Lote', 120);
//		$fields[] = new Model_Grid_Fields('touro_id', 'Touro', 150);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'cobertura/local',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'cobertura/local',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'cobertura/local',
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
