<?php

/**
 * @package Controller
 */

/**
 * MatrizgrController
 * 
 * Controla requisi��es de manipula��o de matriz de graus de sangue.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class MatrizgrController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Matriz de Graus de Sangue';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$matrizgrModel = new Model_Db_MatrizGrauSangue();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $matrizgrModel->getPaginatorAdapter($_by, $_order, array('raca_dsc', 'pai_dsc', 'mae_dsc', 'cria_dsc'));
		

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

		$fields[] = new Model_Grid_Fields('raca_dsc', 'Ra�a', 'auto');
		$fields[] = new Model_Grid_Fields('pai_dsc', 'Gr. Sangue Pai', '160');
		$fields[] = new Model_Grid_Fields('mae_dsc', 'Gr. Sangue M�e', '160');
		$fields[] = new Model_Grid_Fields('cria_dsc', 'Gr. Sangue Cria', '160');

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'matrizgr',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'matrizgr',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'matrizgr',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;

	}

	public function addAction()
	{

		$matrizgrForm = new Form_MatrizGr();
		$matrizgrForm->setAction('/matrizgr/add');
		$matrizgrForm->setMethod('post');
		$this->view->elements = array(array('raca'), array('pai'), array('mae'), array('cria'));
		$this->view->form = $matrizgrForm;

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($matrizgrForm->isValid($formData)) {
				$matrizgrModel = new Model_Db_MatrizGrauSangue();
				if ($matrizgrModel->addMatrizGrauSangue(array(
					'raca_id' => $matrizgrForm->getValue('raca_id'),
					'pai_id' => $matrizgrForm->getValue('pai_id'),
					'mae_id' => $matrizgrForm->getValue('mae_id'),
					'cria_id' => $matrizgrForm->getValue('cria_id')
				))) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
				
			} else {

				$matrizgrForm->populate($formData);

			}
		}

	}

	public function editAction()
	{

		$request		= $this->getRequest();
		$matrizgrId		= (int)$request->getParam('id');
		$matrizgrForm	= new Form_MatrizGr();
		$racaModel	= new Model_Db_Raca();
		
		$matrizgrForm->setAction('/matrizgr/edit');
		$matrizgrForm->setMethod('post');
		$matrizgrModel = new Model_Db_MatrizGrauSangue();
		$matrizgrForm->getElement('raca_id')
			->removeValidator('NoRecordExists')
			;
		$matrizgrForm->getElement('raca_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;
		$matrizgrForm->getElement('raca')
			->setAttribs(array(
				'disabled'	=> 'disabled',
				'class'		=> 'readonly',
			))
			->setRequired(false);

		$matrizgrForm->getElement('pai_id')
			->removeValidator('NoRecordExists')
			;
		$matrizgrForm->getElement('pai_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;
		$matrizgrForm->getElement('pai')
			->setAttribs(array(
				'disabled'	=> 'disabled',
				'class'		=> 'readonly',
			))
			->setRequired(false);

		$matrizgrForm->getElement('mae_id')
			->removeValidator('NoRecordExists')
			;
		$matrizgrForm->getElement('mae_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;
		$matrizgrForm->getElement('mae')
			->setAttribs(array(
				'disabled'	=> 'disabled',
				'class'		=> 'readonly',
			))
			->setRequired(false);

		if ($request->isPost()) {

			if ($matrizgrForm->isValid($request->getPost())) {
				$matrizgrModel->updateMatrizGrauSangue($matrizgrForm->getValues());
				$this->_redirect('/'. $this->getRequest()->getControllerName());
			}

		} else {

			if ($matrizgrId > 0) {
				$result = $matrizgrModel->getMatrizGrauSangue($matrizgrId);
				$matrizgrForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array('id', array('raca'), array('pai'), array('mae'), array('cria'));
		$this->view->form = $matrizgrForm;

	}

	public function deleteAction()
	{

		$request = $this->getRequest();
		$matrizgrForm = new Form_MatrizGr();
		$matrizgrForm->setAction('matrizgr/delete');
		$matrizgrForm->setMethod('post');
		$matrizgrModel = new Model_Db_MatrizGrauSangue();

		if ($request->isPost() && $request->getParam('param', false) == 'matrizgr') {
			$matrizgrId	= (int)$request->getParam('id');
			$matrizgrModel->deleteMatrizGrauSangue($matrizgrId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$matrizgrId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$matrizgrId.')';
		}
		$this->view->url = 'matrizgr/index';

	}

}
