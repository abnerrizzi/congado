<?php

/**
 * @package Controller
 */

/**
 * ColetaembController
 * 
 * Controla requisições de manipulação das coletas de embrioes.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id: ColetaembController.php 353 2010-06-22 19:25:16Z bacteria_ $
 */
class ColetaembController extends Zend_Controller_Action
{

    public function init()
    {
        $auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Coleta de Embriões';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
        $gridModel = new Model_Grid($this->view->title);
        $coletaModel = new Model_Db_ColetaEmbriao();

        $_page	= $this->_getParam('page', 1);
		$_by	= $this->_getParam('by', 'id');
		$_order	= $this->_getParam('sort', 'asc');

		$result = $coletaModel->getPaginatorAdapter($_by, $_order);

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
		$fields[] = new Model_Grid_Fields('data_coleta', 'Coleta', 70);
		$fields[] = new Model_Grid_Fields('vaca_cod', 'Vaca (cod)', 75);
		$fields[] = new Model_Grid_Fields('vaca_nome', 'Vaca', 150);
		$fields[] = new Model_Grid_Fields('touro_cod', 'Touro (cod)', 75);
		$fields[] = new Model_Grid_Fields('touro_nome', 'Touro', 150);

		/*
		 * Grid Model
		 */
		$gridModel->setBaseUrl($this->view->baseUrl);
		$gridModel->setSorting(true);
		$gridModel->setPaginator($paginator);
		$gridModel->setFields($fields);
		$gridModel->setEdit(array(
			'module'	=> 'coletaemb',
			'action'	=> 'edit',
		));
		$gridModel->setDelete(array(
			'module'	=> 'coletaemb',
			'action'	=> 'delete',
		));
		$gridModel->setAdd(array(
			'module'	=> 'coletaemb',
			'action'	=> 'add',
		));

		$this->view->sort = $_order;
		$this->view->grid = $gridModel;
    }

    public function editAction()
    {

    	$request		= $this->getRequest();
    	$coletaId		= $request->getParam('id');
		$coletaForm		= new Form_ColetaEmbriao();

		$coletaForm->setACtion('/coletaemb/edit');
		$coletaForm->setMethod('post');

	    /*
		 * Populando select de fazendas
		 */
		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$coletaForm->getElement('fazenda_id')
			->addMultiOption(false, '--')
			->setAttrib('disabled', 'disabled')
		;
		foreach ($fazendas as $fazenda) {
			$coletaForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}

    	$this->view->form = $coletaForm;
    	$this->view->elements = array(
    		'id',
    		array('vaca'),
    		'fazenda_id',
    		'dt_coleta',
    		'ciotipo',
    		'hormonio',
    		'trata_inicio',
    		'trata_final',
    		'dosagem',
    		'distribuicao',

    		'soro_nome',
    		'soro_partida',
//    		'meio_nome',
//    		'meio_partida'
    	);

    	$coletaModel = new Model_Db_ColetaEmbriao();

    	if ($request->isPost()) {

//			if ($doencaForm->isValid($request->getPost())) {
//				$values = $doencaForm->getValues(true);
//				unset($values['submit'], $values['cancel'], $values['delete']);
//				$doencaModel->updateDoenca($values);
//				$this->_redirect('/'. $this->getRequest()->getControllerName());
//			}

    		throw new Zend_Controller_Exception('sequencia de alteracao nao implementada');
		} else {

			if ($coletaId > 0) {
				$result = $coletaModel->getColetaEmbriao($coletaId);
				$coletaForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}


    }

}

