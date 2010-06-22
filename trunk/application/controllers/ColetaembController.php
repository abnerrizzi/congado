<?php

/**
 * @package Controller
 */

/**
 * ColetaembController
 * 
 * Controla requisições de manipulação das coletas de embrioes.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */
class ColetaembController extends Zend_Controller_Action
{

    public function init()
    {
        $auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Coleta de Embriões';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
        $gridModel = new Model_Grid($this->view->title);
        $coletaModel = new Model_Db_ColetaEmbriao();

        $_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');

		$result = $coletaModel->getPaginatorAdapter($_by, $_order);

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
		$fields[] = new Model_Grid_Fields('data_coleta', 'Coleta', 70);
		$fields[] = new Model_Grid_Fields('vaca_cod', 'Vaca (cod)', 75);
		$fields[] = new Model_Grid_Fields('vaca_nome', 'Vaca', 150);
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
			'module'	=> 'coletaemb',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'coletaemb',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'coletaemb',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
    }

    public function editAction()
    {
    	$this->view->form = new Zend_Form();
    	$this->view->elements = array();
    }

}

