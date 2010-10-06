<?php

/**
 * @package Controller
 */

/**
 * @TODO: Criar validador ao associar ao animal
 * CategoriaController
 * 
 * Controla requisições de manipulação das categorias.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */
class CategoriaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Categoria';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{

		$gridModel = new Model_Grid($this->view->title);
		$categoriaModel = new Model_Db_Categoria();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');

		// Workaround to get sex description from cod
		$sexo = new Zend_Db_Expr("CASE sexo when 'M' then 'MACHO'
    when 'F' then 'FEMEA'
    else 'INDIFERENTE'
    end as sexo");
		
		$result	= $categoriaModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc', $sexo));

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
		$fields[] = new Model_Grid_Fields('cod', 'C&oacute;digo', 20);
		$fields[] = new Model_Grid_Fields('dsc', 'Descri&ccedil;&atilde;o', 150);
		$fields[] = new Model_Grid_Fields('sexo', 'Sexo', 70);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'categoria',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'categoria',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'categoria',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
	}

	public function editAction()
	{

		$request		 = $this->getRequest();
		$categoriaId	= (int)$request->getParam('id');
		$categoriaForm	= new Form_Categoria();
		$categoriaForm->setAction('/categoria/edit');
		$categoriaForm->setMethod('post');
		$categoriaModel = new Model_Db_Categoria();
		$categoriaForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$categoriaForm->getElement('sexo')
			->setSeparator('&nbsp;')
			;
		if ($request->isPost()) {

			if ($categoriaForm->isValid($request->getPost())) {
				$categoriaModel->updateCategoria($categoriaForm->getValues());
				$this->_redirect('/'. $this->getRequest()->getControllerName());
			}
		} else {
			if ($categoriaId > 0) {
				$result = $categoriaModel->getCategoria($categoriaId);
				$categoriaForm->populate($result);
			} else {
				throw new Exception("invalid record number.");
			}
		}

		$this->view->elements = array('id', 'cod', 'dsc', 'sexo', 'delete');
		$this->view->form = $categoriaForm;
	}

	public function addAction()
	{

		$categoriaForm = new Form_Categoria();
		$categoriaForm->setAction('/categoria/add');
		$categoriaForm->setMethod('post');
		$this->view->form = $categoriaForm;
		$this->view->elements = array('cod', 'dsc', 'unidade');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($categoriaForm->isValid($formData)) {
				$cod = $categoriaForm->getValue('cod');
				$dsc = $categoriaForm->getValue('dsc');
				$unidade = floatval($categoriaForm->getValue('unidade'));
				$categoriaModel = new Model_Db_Categoria();
				if ($categoriaModel->addCategoria($cod, $dsc, $unidade)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			} else {
				$categoriaForm->populate($formData);
			}
		}
	}

	public function deleteAction()
	{

		$request		= $this->getRequest();
		$categoriaForm	= new Form_Categoria();
		$categoriaForm->setAction('/categoria/delete');
		$categoriaForm->setMethod('post');
		$categoriaModel = new Model_Db_Categoria();

		if ($request->isPost() && $request->getParam('param', false) == 'categoria') {
			$categoriaId = (int)$request->getParam('id');
			$categoriaModel->deleteCategoria($categoriaId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$categoriaId = (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro ('.$categoriaId.')';
		}
		$this->view->url = 'categoria/index';
	}

}
