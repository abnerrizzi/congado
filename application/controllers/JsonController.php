<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @version: $Id$
 * 
 */

class JsonController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Locais';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		$this->initView();
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
		Zend_Layout::startMvc(array(
			'layout' => 'json',
		));
	}

	public function cidadesAction()
	{
		$cidadesModel = new Model_Db_Estado_Cidades();
		$cidades = $cidadesModel->getCidades($this->getRequest()->getParam('id'));
		$this->view->content = utf8_encode(json_encode($cidades));
		$this->render('index');
	}

	public function racaAction()
	{
		$racaModel = new Model_Db_Raca();
		$racas = $racaModel->listRacasJson(
			array(
				'id',
				'cod',
				'dsc',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($racas));
		$this->render('index');
	}

	public function criadorAction()
	{
		$criadorModel = new Model_Db_Criador();
		$criadores = $criadorModel->listCriadoresJson(
			array(
				'id',
				'cod',
				'dsc',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($criadores));
		$this->render('index');
	}

	public function pelagemAction()
	{
		$pelagemModel = new Model_Db_Pelagem();
		$pelagens = $pelagemModel->listRacasJson(
			array(
				'id',
				'cod',
				'dsc',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($pelagens));
		$this->render('index');
	}

	public function rebanhoAction()
	{
		$rebanhoModel = new Model_Db_Rebanho();
		$rebanhos = $rebanhoModel->listRebanhosJson(
			array(
				'id',
				'cod',
				'dsc',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($rebanhos));
		$this->render('index');
	}

	public function categoriaAction()
	{
		$categoriaModel = new Model_Db_Categoria();
		$categorias = $categoriaModel->listCategoriasJson(
			array(
				'id',
				'cod',
				'dsc',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($categorias));
		$this->render('index');
	}

	public function grausangueAction()
	{
		$grausangueModel = new Model_Db_Grausangue();
		$graus = $grausangueModel->listGrauSangueJson(
			array(
				'id',
				'cod',
				'dsc',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($graus));
		$this->render('index');
	}

	public function localAction()
	{
		$localModel = new Model_Db_Local();
		$locais = $localModel->listLocaisJson(
			array(
				'id',
				'local',
				'dsc',
			),
			$this->getRequest()->getParam('sortname','local'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('fazenda_id'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($locais));
		$this->render('index');
	}

	public function animalAction()
	{
		$animalModel = new Model_Db_Fichario();
		$animais = $animalModel->listFichariosJson(
			array(
				'id',
				'cod',
				'nome',
				'rgn',
				'sisbov',
				'sexo',
				'categoria',
				'raca',
				'grsangue',
			),
			$this->getRequest()->getParam('sortname', false),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false),
			array(
				'sexo' => $this->getRequest()->getParam('sexo', false),
			)
		);
		$this->view->content = utf8_encode(json_encode($animais));
		$this->render('index');
	}

	public function filhosAction()
	{
		$__id = (int)substr($this->getRequest()->getParam('id', false),1);
		$__method = $this->getRequest()->getParam('method', 'html');
		if ($__id > 0) {
			$ficharioModel = new Model_Db_Fichario();
			$_return = $ficharioModel->getFilhos($__id);
		} else {
			$_return = false;
		}
		$this->view->content = $_return;

		if ($__method == 'html') {
			$this->render('html-filhos');
		} else {
			$this->render('index');
		}
		
	}




	public function grsangueAction()
	{
		$racaModel = new Model_Db_Grausangue();
		$racas = $racaModel->listGrauSangueJson(
			array(
				'id',
				'cod',
				'dsc',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query')
		);
		$this->view->content = utf8_encode(json_encode($racas));
		$this->render('index');
	}

	private function _getFlexigrid()
	{
		$front = $this->getFrontController();
		$flexigrid = new Plugin_JQuery_Flexigrid($front->getBaseUrl() . '/json/raca');

		$flexigrid
			->setTitle('Clientes')
			->orderBy(
				$this->_getParam('sortname', 'cliente_nome'),
				$this->_getParam('sortorder', Plugin_JQuery_Flexigrid::SORT_ASC)
			);

		$flexigrid
			->addColumn('text', 'cliente_nome', array(
			'label' => 'Nome'
			))
			->addColumn('text', 'cliente_email', array(
			'label' => 'Email'
			))
			->addColumn('date', 'cliente_nascimento', array(
			'label' => 'Data de Nascimento',
			'align' => Plugin_JQuery_Flexigrid_Column_Abstract::ALIGN_CENTER
			))
			->addColumn('checkbox', 'cliente_ativo', array(
			'label' => 'Ativo?',
			'align' => Plugin_JQuery_Flexigrid_Column_Abstract::ALIGN_CENTER
			));

		//seletor e atributos da tabela
		$flexigrid
			->setSelector('#grid-filter')
			->addTableAttrib('id', 'grid-filter');

		//paginacao
		$flexigrid->configPaginator($this->_getParam('rp', 20), $this->_getParam('page', 1));

		return $flexigrid;
	}



}
