<?php
/**
 * @package Controller
 */

/**
 * PelagemController
 * 
 * Controla requisições de manipulação de pelagens.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */

class Tabela_PelagemController extends Plugin_DefaultController
{

	public function init()
	{
        $this->view->title = 'Tabela :: Pelagem';
        $this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$pelagemModel = new Model_Db_Pelagem();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'cod');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $pelagemModel->getPaginatorAdapter($_by, $_order, array('id', 'cod', 'dsc'));

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
		$fields[] = new Model_Grid_Fields('dsc','Descri&ccedil;&atilde;o', 150);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'tabela/pelagem',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'tabela/pelagem',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'tabela/pelagem',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;

	}

	public function editAction()
	{
		$request		= $this->getRequest();
		$pelagemId		= (int)$request->getParam('id');
		$pelagemForm	= new Form_Pelagem();
		$pelagemForm->setAction('/'.$this->getRequest()->getModuleName().'/'.$this->getRequest()->getControllerName().'/edit');
		$pelagemForm->setMethod('post');
		$pelagemModel = new Model_Db_Pelagem();
		$pelagemForm->getElement('cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($pelagemForm->isValid($request->getPost())) {
				$pelagemModel->updatePelagem($pelagemForm->getValues());
				$this->_redirect('/'.$this->getRequest()->getModuleName() .'/'. $this->getRequest()->getControllerName());
			}
		} else {
			if ($pelagemId > 0) {
				$result = $pelagemModel->getPelagem($pelagemId);
				$pelagemForm->populate( $result );
			} else {
				throw new Exception("invalid record number.");
			}
		}
		$this->view->elements = array('id', 'cod', 'dsc', 'delete');
		$this->view->form = $pelagemForm;
	}

	public function addAction()
	{

		$pelagemForm = new Form_Pelagem();
		$pelagemForm->setAction('/'.$this->getRequest()->getModuleName().'/'.$this->getRequest()->getControllerName().'/add');
		$pelagemForm->setMethod('post');
		$this->view->form = $pelagemForm;
		$this->view->elements = array('cod', 'dsc');

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($pelagemForm->isValid($formData)) {
				$cod = $pelagemForm->getValue('cod');
				$dsc = $pelagemForm->getValue('dsc');
				$pelagemModel = new Model_Db_Pelagem();
				if ($pelagemModel->addPelagem($cod, $dsc)) {
					$this->_redirect('/'.$this->getRequest()->getModuleName() .'/'. $this->getRequest()->getControllerName());
				}
			} else {
				$pelagemForm->populate($formData);
			}
		}
	}

	public function deleteAction()
	{
		$request		= $this->getRequest();
		$pelagemForm	= new Form_Pelagem();
		$pelagemForm->setAction('/'.$this->getRequest()->getModuleName().'/'.$this->getRequest()->getControllerName().'/delete');
		$pelagemForm->setMethod('post');
		$pelagemModel = new Model_Db_Pelagem();

		if ($request->isPost() && $request->getParam('param', false) == $this->getRequest()->getModuleName().'/'.$this->getRequest()->getControllerName()) {
			$pelagemId	= (int)$request->getParam('id');
			$pelagemModel->deletePelagem($pelagemId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$pelagemId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro ('.$pelagemId.')';
		}
		$this->view->url = $request->getModuleName() .'/'. $request->getControllerName();


	}

}
