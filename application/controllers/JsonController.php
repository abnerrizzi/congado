<?php

/**
 * @package Controller
 */

/**
 * JsonController
 * 
 * Controla requisições JSON.
 * 
 * Faz a interface de comunicação entre aplicações que utilizam JSON
 * e o banco de dados, transformando os dados necessários no formato JSON.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
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

	/**
	 * cidadesAction
	 * 
	 * Retorna uma string no formato JSON com a lista de cidades referente ao
	 * estado informado atraves do parametro 'id'
	 * 
	 * @return (string|JSON)
	 */
	public function cidadesAction()
	{
		$cidadesModel = new Model_Db_Estado_Cidades();
		$cidades = $cidadesModel->getCidades($this->getRequest()->getParam('id'));
		$this->view->content = utf8_encode(json_encode($cidades));
		$this->render('index');
	}

	/**
	 * racaAction
	 * 
	 * Retorna uma string no formato JSON com a lista de racas com o padrao
	 * jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function racaAction()
	{
		$racaModel = new Model_Db_Raca();
		$racas = $racaModel->listJson(
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

	/**
	 * criadorAction
	 * 
	 * Retorna uma string no formato JSON com a lista de criadores com o padrao
	 * jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function criadorAction()
	{
		$criadorModel = new Model_Db_Criador();
		$criadores = $criadorModel->listJson(
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

	/**
	 * pelagemAction
	 * 
	 * Retorna uma string no formato JSON com a lista de pelagens com o padrao
	 * jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function pelagemAction()
	{
		$pelagemModel = new Model_Db_Pelagem();
		$pelagens = $pelagemModel->listJson(
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

	/**
	 * rebanhoAction
	 * 
	 * Retorna uma string no formato JSON com a lista de rebanhos com o padrao
	 * jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function rebanhoAction()
	{
		$rebanhoModel = new Model_Db_Rebanho();
		$rebanhos = $rebanhoModel->listJson(
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

	/**
	 * categoriaAction
	 * 
	 * Retorna uma string no formato JSON com a lista de categorias com o padrao
	 * jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function categoriaAction()
	{
		$categoriaModel = new Model_Db_Categoria();
		$categorias = $categoriaModel->listJson(
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

	/**
	 * morteAction
	 * 
	 * Retorna uma string no formato JSON com a lista de categorias com o padrao
	 * jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function morteAction()
	{
		$categoriaModel = new Model_Db_Morte();
		$categorias = $categoriaModel->listJson(
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

	/**
	 * inseminadorAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function inseminadorAction()
	{
		$grausangueModel = new Model_Db_Inseminador();
		$graus = $grausangueModel->listJson(
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

	/**
	 * partoAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function partoAction()
	{
		$grausangueModel = new Model_Db_Parto();
		$graus = $grausangueModel->listJson(
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

	/**
	 * acompanhamentoAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function acompanhamentoAction()
	{
		$grausangueModel = new Model_Db_Acompanhamento();
		$graus = $grausangueModel->listJson(
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

	/**
	 * tecnicoAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function tecnicoAction()
	{
		$grausangueModel = new Model_Db_Tecnico();
		$graus = $grausangueModel->listJson(
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

	/**
	 * doencaAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function doencaAction()
	{
		$grausangueModel = new Model_Db_Doenca();
		$graus = $grausangueModel->listJson(
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

	/**
	 * alimentoAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function alimentoAction()
	{
		$grausangueModel = new Model_Db_Alimento();
		$graus = $grausangueModel->listJson(
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

	/**
	 * destinoAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function destinoAction()
	{
		$grausangueModel = new Model_Db_Destino();
		$graus = $grausangueModel->listJson(
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

	/**
	 * ativagricolaAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function ativagricolaAction()
	{
		$grausangueModel = new Model_Db_Ativagricola();
		$graus = $grausangueModel->listJson(
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

	/**
	 * situacaocriaAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function situacaocriaAction()
	{
		$grausangueModel = new Model_Db_SituacaoCria();
		$graus = $grausangueModel->listJson(
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

	/**
	 * situacaopesagemAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function situacaopesagemAction()
	{
		$grausangueModel = new Model_Db_SituacaoPesagem();
		$graus = $grausangueModel->listJson(
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

	/**
	 * grausangueAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function grausangueAction()
	{
		$grausangueModel = new Model_Db_Grausangue();
		$graus = $grausangueModel->listJson(
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

	/**
	 * localAction
	 * 
	 * Retorna uma string no formato JSON com a lista de locais com o padrao
	 * jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function localAction()
	{
		$localModel = new Model_Db_Local();
		$locais = $localModel->listJsonLocal(
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

	/**
	 * inseminadorAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function loteAction()
	{
		$grausangueModel = new Model_Db_Lote();
		$graus = $grausangueModel->listJsonLote(
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
			$this->getRequest()->getParam('fazenda_id'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($graus));
		$this->render('index');
	}

	/**
	 * animalAction
	 * 
	 * Retorna uma string no formato JSON com a lista de animais com o padrao
	 * jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function animalAction()
	{
		$animalModel = new Model_Db_Fichario();
		if ($this->getRequest()->getParam('sortname', false)) {
			$sortname = $this->getRequest()->getParam('sortname', false);
		} elseif ($this->getRequest()->getParam('sidx', false)) {
			$sortname = $this->getRequest()->getParam('sidx', false);
		} else {
			$sortname = false;
		}

		if ($this->getRequest()->getParam('sortorder', false)) {
			$sortorder = $this->getRequest()->getParam('sortorder', false);
		} elseif ($this->getRequest()->getParam('sord', false)) {
			$sortorder = $this->getRequest()->getParam('sord', false);
		} else {
			$sortorder = 'asc';
		}

		if ($this->getRequest()->getParam('rp', false)) {
			$rp = $this->getRequest()->getParam('rp');
		} elseif ($this->getRequest()->getParam('rows', false)) {
			$rp = $this->getRequest()->getParam('rows');
		} else {
			$rp = 10;
		}

		$animais = $animalModel->listJsonFicharios(
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
			$sortname,
			$sortorder,
			$this->getRequest()->getParam('page','1'),
			$rp,
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

	/**
	 * filhosAction
	 * 
	 * Retorna uma string no formato JSON com a lista de filhos do animal com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function filhosAction()
	{
		$__id = (int)substr($this->getRequest()->getParam('id', false),1);
		$__method = $this->getRequest()->getParam('method', 'html');
		if ($this->getRequest()->getParam('link', false) != false) {
			$this->view->link = true;
		}
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

	/**
	 * coletaembAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function coletaembAction()
	{
		$coletaEmbriaoModel = new Model_Db_ColetaEmbriao();
		$coletas = $coletaEmbriaoModel->listJsonColetaEmbriao(
			array(),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($coletas));
		$this->render('index');
	}

	/**
	 * verifyEmbrioesAction
	 *
	 * Retorna uma string no formato JSON com a lista de embrioes ja cadastrados
	 * no banco dedados. Caso nao exista, retorna uma string JSON vazia.
	 *
	 * @param (array|cod) Codigos para serem verificados se ja estao cadastrado no banco de dados.
	 * @return (string|JSON)
	 */
	public function verifyembrioesAction()
	{
		$__fazenda_id = (int)$this->getRequest()->getParam('fazenda_id');
		$__embrioes = (array)$this->getRequest()->getParam('cod');

		$estoqueModel = new Model_Db_EstoqueEmbriao();
		$__embrioes = $estoqueModel->checkEmbrioesNames($__fazenda_id, $__embrioes);

		$this->view->content = utf8_encode(json_encode($__embrioes));
		$this->render('index');
	}

	/**
	 * estoqueEmbriaoAction
	 * 
	 * Retorna uma string no formato JSON com a lista de graus de sangue com o padrao jqGrid
	 *  
	 * @return (string|JSON)
	 */
	public function estoqueembriaoAction()
	{
		$estoqueModel = new Model_Db_EstoqueEmbriao();
		$estoques = $estoqueModel->listJsonEstoqueEmbriao(
			array(),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('like', false)
		);
		$this->view->content = utf8_encode(json_encode($estoques));
		$this->render('index');
	}

	public function estoqueembAction()
	{
		return $this->estoqueembriaoAction();
	}

	public function ultimoembriaoAction()
	{
		$estoqueModel = new Model_Db_EstoqueEmbriao();
		$__id = (int)$this->getRequest()->getParam('id', false);
		if ($__id > 0) {
			$ultimo = $estoqueModel->listJsonUltimo($__id);
		}
		$this->view->content = utf8_encode(json_encode($ultimo));
		$this->render('index');
	}

	public function ficharioAction()
	{
		$ficharioModel = new Model_Db_Fichario();
		$ficharios = $ficharioModel->listJsonFicharios(
			array(
				'id',
				'cod',
				'nome',
			),
			$this->getRequest()->getParam('sortname','cod'),
			$this->getRequest()->getParam('sortorder','asc'),
			$this->getRequest()->getParam('page','1'),
			$this->getRequest()->getParam('rp'),
			$this->getRequest()->getParam('qtype'),
			$this->getRequest()->getParam('query'),
			$this->getRequest()->getParam('fazenda_id'),
			$this->getRequest()->getParam('like', false),
			array('sexo' => $this->getRequest()->getParam('sexo', false))
		);
		$this->view->content = utf8_encode(json_encode($ficharios));
		$this->render('index');
	}

	/**
	 * _getFlexigrid
	 * 
	 * Função experimental em desuso
	 * 
	 */
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

	public function fcbkAction()
	{
		$ficharioModel = new Model_Db_Fichario();
		$this->view->content = utf8_encode(json_encode($ficharioModel->listJsonAutocomplete($this->getRequest()->getParam('tag'))));
//		for ($i=0; $i < 5; $i++)
//		{
//			$return[] = array(
//				"caption" => $this->getRequest()->getParam('tag', 'Nome de Teste').$i,
//				"value" => $i
//			);
//		}
//
//		$this->view->content = utf8_encode(json_encode($return));
		$this->render('index');
	}

}
