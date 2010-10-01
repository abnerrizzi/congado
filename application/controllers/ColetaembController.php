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
 * @version $Id$
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

		// Disable form elements
		$disable_elements = array(
			'vaca_cod',
			'dt_coleta',
			'touro_cod',
			'insemina_dh1d', 'insemina_dh1h', 'dose1', 'partida1',
			'insemina_dh2d', 'insemina_dh2h', 'dose2', 'partida2',
			'insemina_dh3d', 'insemina_dh3h', 'dose3', 'partida3',
			'insemina_dh4d', 'insemina_dh4h', 'dose4', 'partida4',
		);
		foreach ($disable_elements as $el) {
			$coletaForm->getElement($el)
			->setAttrib('readonly', 'readonly')
			->setAttrib('disable', true);
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
    	);

    	$coletaModel = new Model_Db_ColetaEmbriao();

    	if ($request->isPost()) {

    		if ($coletaForm->isValid($request->getPost())) {
    			$data = $this->adjustFormsValues($coletaForm);
    			$coletaModel->updateColeta($data);
    			$this->_redirect('/'. $this->getRequest()->getControllerName());
    		}

		} else {

			if ($coletaId > 0) {
				$result = $coletaModel->getColetaEmbriao($coletaId);
				$embriaoModel = new Model_Db_EstoqueEmbriao();
				$this->view->embrioes = $embriaoModel->getByColeta($coletaId);
				$coletaForm->populate($result);
			} else {
				throw new Exception("invalid record number");
			}
		}

    }

    public function addAction()
    {
    	$coletaForm		= new Form_ColetaEmbriao();

    	/*
		 * Populando select de fazendas
		 */
		$fazendaModel = new Model_Db_Fazenda();
		$fazendas = $fazendaModel->listFazendas(array('id', 'descricao'));
		$coletaForm->getElement('fazenda_id')
			->addMultiOption(false, '--');
		foreach ($fazendas as $fazenda) {
			$coletaForm->getElement('fazenda_id')
				->addMultiOption($fazenda['id'], $fazenda['descricao']);
		}
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
    	);

    	$__integerElements = array(
    		'dosagem',
    		'gnrh_dosagem',
    		'prost_dosagem',
    		'dose1',
    		'dose2',
    		'dose3',
    		'dose4',
    		'avalia_od',
    		'avalia_oe',
    		'fecundada',
    		'nao_fecundada',
    		'viavel',
    		'nao_viavel',
    	);

		if ($this->getRequest()->isPost()) {
			$formData = $this->getRequest()->getPost();
			// Adicionando filtro de inteiro
			foreach ($__integerElements as $var) {
				$coletaForm->getElement($var)->addFilter('Int');
				
			}
			if ($coletaForm->isValid($formData)) {
				$coletaModel = new Model_Db_ColetaEmbriao();
				$post = $this->adjustFormsValues($coletaForm);

				// faz a contagem de embrioes passados vs. numero de embrioes viaveis
				$embriaoPost = $this->getRequest()->getParam('embriao');
				if ((int)$post['viavel'] == count($this->getRequest()->getParam('embriao'))) {
					foreach ($embriaoPost as $embriao)
					{
						$embriao['embriao']			= $embriao['cod'];
						$embriao['classificacao']	= $embriao['class'];
						$embriao['criador_id']		= $embriao['criador'];
						$embriao['fazenda_id']		= $post['fazenda_id'];
						$embriao['dt_coleta']		= $post['dt_coleta'];
						$embriao['doadora_id']		= $post['vaca_id'];
						$embriao['touro_id']		= $post['touro_id'];
						unset($embriao['class'], $embriao['cod'], $embriao['criador']);
						$embrioes[] = $embriao;
					}
					$embriaoModel = new Model_Db_EstoqueEmbriao();
					if ($coletaModel->addColeta($post)) {
						if ($embriaoModel->addEmbrioes($embrioes)) {
							$this->_redirect('/'. $this->getRequest()->getControllerName());
						}
					}

				} else {
					$json_Embriao = json_encode($this->getRequest()->getParam('embriao'));
					$this->view->embriao = $json_Embriao;
					$this->view->ultimo = $this->getRequest()->getParam('ultimo');
					$coletaForm->populate($formData);
					$_criadores = array();
					foreach ($this->getRequest()->getParam('embriao') as $_temp) {
						if ($_temp['criador'] != "") {
							$_criadores[] = $_temp['criador'];
						}
					}
					$criadorModel = new Model_Db_Criador();
					$this->view->criadorJson = json_encode($criadorModel->getCods($_criadores));
				}

//				if ($coletaModel->addColeta($post)) {
//					$this->_redirect('/'. $this->getRequest()->getControllerName());
//				}
			} else {
				$coletaForm->populate($formData);
			}
		}

    }

    public function deleteAction()
    {
    	$request = $this->getRequest();
    	$coletaForm = new Form_ColetaEmbriao();
    	$coletaForm->setAction('coletaemb/delete');
		$coletaForm->setMethod('post');
		$coletaModel = new Model_Db_ColetaEmbriao();

		if ($request->isPost() && $request->getParam('param', false) == 'coletaemb') {
			$coletaId	= (int)$request->getParam('id');
			$coletaModel->deleteColeta($coletaId);
			$this->view->error = false;
			$this->view->msg = 'Registro apagado com sucesso.';
		} else {
			$coletaId	= (int)$request->getParam('id');
			$this->view->error = true;
			$this->view->msg = 'Erro tentando apagar registro('.$coletaId.')';
		}
		$this->view->url = 'coletaemb/index';

    }

    private function adjustFormsValues(Zend_Form $form)
    {
    	$post = $form->getValues();

    	// remove buttons and complementary fields
    	$__buttons = array(
    		'submit',
    		'cancel',
    		'delete',
			'vaca_cod',
			'vaca',
			'touro_cod',
			'touro',
			'obs'
    	);
    	for ($i=0; $i < count($__buttons); $i++)
    	{
    		unset($post[$__buttons[$i]]);
    	}

    	// change DATE fields format
    	$_datas = array(
			'dt_coleta',
			'trata_inicio',
			'trata_final',

		);
		foreach ($post as $key => $val) {
			if (in_array($key, $_datas) && $val != NULL) {
				$x = explode('/', $val);
				$val = $x[2] .'-'. $x[1] .'-'. $x[0];
			}
			$return[$key] = utf8_decode($val);
		}

		// change DATETIME fields format
    	$_dh = array(
			'prost_dhd',
			'cio_dhd',
			'gnrh_dhd',
			'insemina_dh1d',
			'insemina_dh2d',
			'insemina_dh3d',
			'insemina_dh4d',
		);
		foreach ($post as $key => $val) {
			if (in_array($key, $_dh) && $val != NULL) {
				$__key = substr($key, 0, -1);
				$x = explode('/', $val);
				$__val = $x[2] .'-'. $x[1] .'-'. $x[0];
				if ($post[$__key.'h'] == "") {
					$__val .= ' 00:00';
				} else {
					$__val .= ' ' . $post[$__key.'h'];
				}
				unset($return[$__key.'d'], $return[$__key.'h']);
				$return[$__key] = utf8_decode($__val);
			} elseif (in_array($key, $_dh) && $val == NULL) {
				$__key = substr($key, 0, -1);
				if ($post[$__key.'d'] == null && $post[$__key.'h'] == null) {
					unset($return[$__key.'d'], $return[$__key.'h']);
				} elseif ($post[$__key.'d'] == null && $post[$__key.'h'] != null) {
//					throw new Zend_Controller_Exception('Existe um horario sem data:');
					die('erro ... horario sem data');
				}
			}
		}

		foreach ($return as $key => $val) {
			if (is_int($val) && $val <= 0) {
				$return[$key] = null;
			} elseif ($val == "") {
				$return[$key] = null;
			}
		}

    	return $return;
    }

}

