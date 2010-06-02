<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: CategoriaController.php 203 2010-04-13 14:22:30Z bacteria_ $
 * 
 */

class Movimentacao_SanitariodoencaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Controle Sanitários - Doença';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$movimentacaoModel = new Model_Db_Sanitario();
		$movimentacaoModel->setTipo(1);

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $movimentacaoModel->getPaginatorAdapter($_by, $_order, array('id', 'dt' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')")));
		
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
		$fields[] = new Model_Grid_Fields('dt', 'Data', 20);
		$fields[] = new Model_Grid_Fields('nome', 'Animal', 150);
		$fields[] = new Model_Grid_Fields('doenca', 'Ocorrência', 200);
		$fields[] = new Model_Grid_Fields('old', 'Destino', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'movimentacao/sanitariodoenca',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'movimentacao/sanitariodoenca',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'movimentacao/sanitariodoenca',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{

		$doencaForm = new Form_Sanitario();
		$doencaForm->setName('controle_sanitario_-_doenca');
		$doencaForm->setAction('/movimentacao/sanitariodoenca/add');
		$doencaForm->setMethod('post');

		$doencaForm->getElement('fichario')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$doencaForm->getElement('sequencia_cod')
			->setLabel('Causa');
		$doencaForm->getElement('sequencia')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;
		/*
		 * Procedimento de validacao e inclusao
		 */
		$doencaForm->getElement('dataproximo')
			->setRequired(false);

		$doencaForm->getElement('ocorrencia_id')->setValue(2);
		$this->view->form = $doencaForm;
		$this->view->elements = array(
			array('fichario'),
			'data',
			array('ocorrencia'),
			array('sequencia'),
			'comentario',
		);

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($doencaForm->isValid($formData)) {
				$doencaModel = new Model_Db_Sanitario();
				$doencaModel->setTipo(0);
				if ($doencaModel->addSanitarioDoenca($this->getRequest()->getParams())) {
					$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
				}
			} else {
				$doencaForm->populate($formData);
				Zend_Debug::dump($doencaForm->getErrors());
			}
		}

	}

}

