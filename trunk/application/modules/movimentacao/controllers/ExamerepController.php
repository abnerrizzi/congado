<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: CategoriaController.php 203 2010-04-13 14:22:30Z bacteria_ $
 * 
 */

class Movimentacao_ExamerepController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Acompanhamento Reprodutivo';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
		$gridModel = new Model_Grid($this->view->title);
		$movimentacaoModel = new Model_Db_Examerep();

		$_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');
		$result	= $movimentacaoModel->getPaginatorAdapter($_by, $_order, array('id', 'data'));
		
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
		$fields[] = new Model_Grid_Fields('data', 'Animal', 20);
		$fields[] = new Model_Grid_Fields('nome', 'Data', 200);
		$fields[] = new Model_Grid_Fields('acompanhamento', 'Acompanhamento', 200);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'movimentacao/examerep',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'movimentacao/examerep',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'movimentacao/examerep',
			'action'	=> 'add',
		));

		$this->view->sort = $this->_getParam('sort', 'id');
		$this->view->grid = $gridModel;
	}

	public function addAction()
	{
		$exameForm = new Form_ExameReprodutivo();
		$exameForm->setAction('/movimentacao/examerep/add');
		$exameForm->setMethod('post');
		$this->view->form = $exameForm;

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			if ($exameForm->isValid($formData))
			{

				// buscar fazenda pelo animal
				$ficharioModel = new Model_Db_Fichario();
				$__fazenda = $ficharioModel->getFichario($exameForm->getValue('fichario_id'));

				$__fichario = $exameForm->getValue('fichario_id');
				$__data = $exameForm->getValue('data');
				$__acompanhamento = $exameForm->getValue('acompanhamento_id');
				$__obs = $exameForm->getValue('obs');

				$exameModel = new Model_Db_Examerep();
				if ($exameModel->addExame($__fazenda, $__fichario, $__data, $__acompanhamento, $__obs)) {
					$this->_redirect('/'.$this->getRequest()->getModuleName() .'/'. $this->getRequest()->getControllerName());
				}
				throw new Zend_Controller_Action_Exception('Implementar validacao dos dados');
			} else {
				$exameForm->populate($formData);
			}
			/*
			if ($exameForm->isValid($formData)) {
				$cod = $exameForm->getValue('cod');
				$dsc = $exameForm->getValue('dsc');
				$unidade = floatval($exameForm->getValue('unidade'));
				$inseminadorModel = new Model_Db_Inseminador();
				if ($inseminadorModel->addInseminador($cod, $dsc, $unidade)) {
					$this->_redirect('/'. $this->getRequest()->getControllerName());
				}
			}
			*/
		}
//		throw new Zend_Controller_Action_Exception('Controlador n�o implementado');
	}

}

