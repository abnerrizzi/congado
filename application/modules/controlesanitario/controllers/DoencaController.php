<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Controlesanitario_DoencaController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Controle Sanitário :: Doença';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$movimentacaoModel = new Model_Db_Sanitario();
		$movimentacaoModel->setTipo(1);

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'dt');
		if ($_by == 'dt') {
			$_by = 'data';
		}
		$_order	= $this->_getParam('sort', 'desc');
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
			'module'	=> 'controlesanitario/doenca',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'controlesanitario/doenca',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'controlesanitario/doenca',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{

		$doencaForm = new Form_Sanitario();
		$doencaForm->setName('controle_sanitario_-_doenca');
		$__action = 	($this->getRequest()->getBaseUrl())
				. '/' .	($this->getRequest()->getModuleName())
				. '/' .	($this->getRequest()->getControllerName())
				. '/' . 'add';

		$doencaForm->setAction($__action);
		$doencaForm->setMethod('post');

		$doencaForm->getElement('fichario')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$doencaForm->getElement('ocorrencia')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$doencaForm->getElement('sequencia_cod')
			->setLabel('Destino');
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
		$doencaForm->getElement('fazenda_id')
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
				$doencaModel->setTipo(1);
				if ($doencaModel->addSanitarioDoenca($this->getRequest()->getParams())) {
					$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
				}
			} else {
				$doencaForm->populate($formData);
				Zend_Debug::dump($doencaForm->getErrors());
			}
		}

	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$doencaId	= (int)$request->getParam('id');
		$doencaForm	= new Form_Sanitario();

		$doencaForm->setName('controle_sanitario_-_doenca');
		$__action = 	($this->getRequest()->getBaseUrl())
				. '/' .	($this->getRequest()->getModuleName())
				. '/' .	($this->getRequest()->getControllerName())
				. '/' . 'edit';
		$doencaForm->setAction($__action);
		$doencaForm->setMethod('post');
		$doencaModel = new Model_Db_Sanitario();
		$doencaModel->setTipo(1);
		$doencaForm->getElement('fichario')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;
		$doencaForm->getElement('fichario_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;
		

		$doencaForm->getElement('ocorrencia')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$doencaForm->getElement('sequencia_cod')
			->setLabel('Destino');
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
		$doencaForm->getElement('fazenda_id')
			->setRequired(false);

		if ($request->isPost()) {

			if ($doencaForm->isValid($request->getPost())) {
				$values = $doencaForm->getValues(true);
				unset($values['submit'], $values['cancel'], $values['delete']);
				$data['id'] = $values['id'];
				$data['data'] = $values['data'];
				$data['sequencia_id'] = $values['sequencia_id'];
				$data['comentario'] = $values['comentario'];
				$data['tiposisbov'] = $values['tiposisbov'];
				$doencaModel->updateDoenca($values);
				$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
			} else {
				print '<pre>';
				print_r($doencaForm->getErrors());
				print '</pre>';
			}

		} else {

			if ($doencaId > 0) {
				$result = $doencaModel->getSanitario($doencaId);
				$doencaForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array(
			'id',
			array('fichario'),
			'data',
			array('ocorrencia'),
			array('sequencia'),
			'delete',
			'comentario',
		);
		$this->view->form = $doencaForm;

	}

	public function deleteAction()
	{
		$request		= $this->getRequest();
		$doencaForm	= new Form_Sanitario();

		$__action = 	($this->getRequest()->getBaseUrl())
				. '/' .	($this->getRequest()->getModuleName())
				. '/' .	($this->getRequest()->getControllerName())
				. '/' . 'delete';
		$doencaForm->setAction($__action);
		$doencaForm->setMethod('post');
		$doencaModel = new Model_Db_Sanitario();
		$doencaModel->setTipo(1);

		$doencaId = (int)$request->getParam('id');
		if ($request->isPost() && $request->getParam('param', false) == 'controlesanitario/doenca') {
			$doencaModel->deleteDoenca($doencaId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$doencaId.')';
		}
		$this->view->url = $this->getRequest()->getModuleName()
			. '/' . $this->getRequest()->getControllerName()
			. '/index';
	}

}
