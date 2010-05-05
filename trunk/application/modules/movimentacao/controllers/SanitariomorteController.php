<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: CategoriaController.php 203 2010-04-13 14:22:30Z bacteria_ $
 * 
 */

class Movimentacao_SanitariomorteController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Controle Sanitários - Morte';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$movimentacaoModel = new Model_Db_Sanitario();
		$movimentacaoModel->setTipo(0);

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		if ($_by == 'dt') {
			$_by = 'data';
		}
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
		$fields[] = new Model_Grid_Fields('doenca', 'Ocorrência', 150);
		$fields[] = new Model_Grid_Fields('old', 'Causa', 250);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'movimentacao/sanitariomorte',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'movimentacao/sanitariomorte',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'movimentacao/sanitariomorte',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{

		$morteForm = new Form_Sanitario();
		$morteForm->setName('controle_sanitario_-_morte');
		$morteForm->setAction('/movimentacao/sanitariomorte/add');
		$morteForm->setMethod('post');

		$morteForm->getElement('fichario')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		$morteForm->getElement('sequencia_cod')
			->setLabel('Causa');
		$morteForm->getElement('sequencia')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;
		/*
		 * Procedimento de validacao e inclusao
		 */

		$morteForm->getElement('ocorrencia_id')->setValue(2);
		$this->view->form = $morteForm;
		$this->view->elements = array(
			'id',
			array('fichario'),
			'data',
			'ocorrencia_id',
			array('sequencia'),
			'comentario',
			'tiposisbov',
		);

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($morteForm->isValid($formData)) {
				$cod = $morteForm->getValue('cod');
				$dsc = $morteForm->getValue('dsc');
				$morteModel = new Model_Db_Sanitario();
				$morteModel->setTipo(0);
				if ($morteModel->addSanitarioMorte($this->getRequest()->getParams())) {
					$this->_redirect('/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName());
				}
			} else {
				$morteForm->populate($formData);
			}
		}
	}

	public function editAction()
	{

		$request	= $this->getRequest();
		$morteId	= (int)$request->getParam('id');
		$morteForm	= new Form_Sanitario();

		$morteForm->setName('controle_sanitario_-_morte');
		$morteForm->setAction('/'.$request->getModuleName().'/'.$request->getControllerName().'/edit');
		$morteForm->setMethod('post');
		$morteModel = new Model_Db_Sanitario();
		$morteModel->setTipo(0);
		$morteForm->getElement('fichario')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;
		$morteForm->getElement('fichario_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;
		$morteForm->getElement('ocorrencia')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;
		$morteForm->getElement('ocorrencia_cod')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			;
		$morteForm->getElement('sequencia_cod')
			->setLabel('Causa');

		$morteForm->getElement('sequencia')
			->setAttrib('readonly', 'readonly')
			->setAttrib('class', 'readonly')
			->removeValidator('NoRecordExists')
			;

		if ($request->isPost()) {

			if ($morteForm->isValid($request->getPost())) {
				$values = $morteForm->getValues(true);
				unset($values['submit'], $values['cancel'], $values['delete']);
				$data['id'] = $values['id'];
				$data['data'] = $values['data'];
				$data['sequencia_id'] = $values['sequencia_id'];
				$data['comentario'] = $values['comentario'];
				$morteModel->updateSanitario($values);
				$this->_redirect('movimentacao/sanitariomorte');
			}

		} else {

			if ($morteId > 0) {
				$result = $morteModel->getSanitario($morteId);
				$morteForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

		$this->view->elements = array(
			'id',
			array('fichario'),
			'data',
			'ocorrencia_id',
			array('sequencia'),
			'comentario',
			'tiposisbov',
			'delete',
		);
		$this->view->form = $morteForm;
	}

	public function deleteAction()
	{
		$request		= $this->getRequest();
		$morteForm	= new Form_Sanitario();
		$morteForm->setAction('/'.$request->getModuleName().'/'.$request->getControllerName().'/delete');
		$morteForm->setMethod('post');
		$morteModel = new Model_Db_Sanitario();
		$morteModel->setTipo(0);

		$morteId = (int)$request->getParam('id');
		if ($request->isPost() && $request->getParam('param', false) == 'movimentacao/sanitariomorte') {
			$morteModel->deleteMorte($morteId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$morteId.')';
		}
		$this->view->url = $this->getRequest()->getModuleName()
			. '/' . $this->getRequest()->getControllerName()
			.'/index';
	}
}

