<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Reproducao_DiagnosticoController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Reprodução :: Diagnóstico de Gestação';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
		$this->_action = 	  '/' .	($this->getRequest()->getModuleName())
						. '/' .	($this->getRequest()->getControllerName());
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$diagnosticoModel = new Model_Db_Diagnostico();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $diagnosticoModel->getPaginatorAdapter($_by, $_order);
		
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
		$fields[] = new Model_Grid_Fields('vaca_cod', 'Código', 70);
		$fields[] = new Model_Grid_Fields('vaca', 'Vaca', 240);
		$fields[] = new Model_Grid_Fields('data', 'Data', 1);
		$fields[] = new Model_Grid_Fields('diag', 'Diagnóstico', 1);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'reproducao/diagnostico',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'reproducao/diagnostico',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'reproducao/diagnostico',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{

		$diagnosticoForm = new Form_Diagnostico();
		$diagnosticoForm->setAction($this->_action . '/add');
		$diagnosticoForm->setMethod('post');
		$this->view->form = $diagnosticoForm;
		$this->view->elements = array(
			'dt_diagnostico',
			array('fichario'),
			'prenha',
		);

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($diagnosticoForm->isValid($formData)) {
				$diagnosticoModel = new Model_Db_Diagnostico();
				if ($diagnosticoModel->addDiagnostico($diagnosticoForm->getValues())) {
					$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
				}
			} else {
				$diagnosticoForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request			= $this->getRequest();
		$diagnosticoId		= (int)$request->getParam('id');
		$diagnosticoForm	= new Form_Diagnostico();

//		$__action = 	  '/' .	($this->getRequest()->getModuleName())
//						. '/' .	($this->getRequest()->getControllerName())
//						. '/' . 'edit';

		$diagnosticoForm->setAction($this->_action . '/edit');
		$diagnosticoForm->setMethod('post');
		$diagnosticoModel = new Model_Db_Diagnostico();

		if ($request->isPost()) {
			$diagnosticoForm->getElement('dt_diagnostico')->setRequired(false);
			if ($diagnosticoForm->isValid($request->getPost())) {
				$diagnosticoModel->updateDiagnostico($diagnosticoForm->getValues());
				$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
			}
		} else {
			if ($diagnosticoId > 0) {
				$result = $diagnosticoModel->getDiagnostico($diagnosticoId);
				$diagnosticoForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$disable_elements = array(
			'dt_diagnostico',
			'fichario', 'fichario_id', 'fichario_cod',
		);
		foreach ($disable_elements as $el) {
			$diagnosticoForm->getElement($el)
				->setAttrib('readonly', 'readonly')
				->setAttrib('disable', true);
		}

		$this->view->form = $diagnosticoForm;
		$this->view->elements = array(
			'id',
			'fazenda_id',
			'dt_diagnostico',
			array('fichario'),
			'prenha',
			'delete',
		);

	}

}
