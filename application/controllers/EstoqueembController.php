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
 * @version $Id: ColetaembController.php 376 2010-08-11 13:06:45Z bacteria_ $
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
			'module'	=> 'estoqueembriao',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'estoqueembriao',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'estoqueembriao',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
    }

}
