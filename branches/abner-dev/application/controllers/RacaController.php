<?php
/**
 * @package Controller
 */

/**
 * RacaController
 * 
 * Controla requisições de manipulação de racas.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class RacaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Raças';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$racaModel = new Model_Db_Raca();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'cod');
		$_order	= $this->_getParam('sort', 'asc');
		$result = $racaModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('cod', 'Raça', 35);
		$fields[] = new Model_Grid_Fields('dsc', 'Descrição', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'raca',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'raca',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'raca',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$racaForm = new Form_Raca();
		$racaForm->setAction('/raca/add');
		$racaForm->setMethod('post');
		$this->view->form = $racaForm;

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($racaForm->isValid($formData)) {
				$cod = $racaForm->getValue('cod');
				$dsc = $racaForm->getValue('dsc');
				$racaModel = new Model_Db_Raca();
				$values = $racaForm->getValues(true);
				unset($values['id'], $values['submit'], $values['cancel']);
				if ($racaModel->addRaca($values)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$racaForm->populate($formData);
			}
		}

	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$racaId		= (int)$request->getParam('id');
		$racaForm	= new Form_Raca();
		
		$racaForm->setAction('/raca/edit');
		$racaForm->setMethod('post');
		$racaModel = new Model_Db_Raca();
		$racaForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($racaForm->isValid($request->getPost())) {
				$values = $racaForm->getValues(true);
				unset($values['submit'], $values['cancel']);
				$racaModel->updateRaca($values);
				$this->_redirect('raca/index');
			}

		} else {

			if ($racaId > 0) {
				$result = $racaModel->getRaca($racaId);
				$racaForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id' , 'cod' , 'dsc', 'delete');
		$this->view->form = $racaForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$racaForm = new Form_Raca();
		$racaForm->setAction('raca/delete');
		$racaForm->setMethod('post');
		$racaModel = new Model_Db_Raca();

		if ($request->isPost() && $request->getParam('param', false) == 'raca') {
			$racaId	= (int)$request->getParam('id');
			$racaModel->deleteRaca($racaId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$racaId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$racaId.')';
		}
		$this->view->url = 'raca/index';

	}

}







