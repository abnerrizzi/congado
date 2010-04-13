<?php
/**
 * @package Controller
 */

/**
 * PartoController
 * 
 * Controla requisições de manipulação de partos.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class PartoController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Tipos de Parto';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$partoModel = new Model_Db_Parto();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $partoModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'Parto', 35);
		$fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'parto',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'parto',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'parto',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$partoForm = new Form_Parto();
		$partoForm->setAction('/parto/add');
		$partoForm->setMethod('post');
		$this->view->form = $partoForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($partoForm->isValid($formData)) {
				$cod = $partoForm->getValue('cod');
				$dsc = $partoForm->getValue('dsc');
				$partoModel = new Model_Db_Parto();
				if ($partoModel->addParto($cod, $dsc)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$partoForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$partoId	= (int)$request->getParam('id');
		$partoForm	= new Form_Parto();
		
		$partoForm->setAction('/parto/edit');
		$partoForm->setMethod('post');
		$partoModel = new Model_Db_Parto();
		$partoForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($partoForm->isValid($request->getPost())) {
				$partoModel->updateParto($partoForm->getValues());
				$this->_redirect('parto/index');
			}

		} else {

			if ($partoId > 0) {
				$result = $partoModel->getParto($partoId);
				$partoForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc', 'delete');
		$this->view->form = $partoForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$partoForm = new Form_Parto();
		$partoForm->setAction('parto/delete');
		$partoForm->setMethod('post');
		$partoModel = new Model_Db_Parto();

		if ($request->isPost() && $request->getParam('param', false) == 'parto') {
			$partoId	= (int)$request->getParam('id');
			$partoModel->deleteParto($partoId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$partoId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$partoId.')';
		}
		$this->view->url = 'parto/index';

	}


}
