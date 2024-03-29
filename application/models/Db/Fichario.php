<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Db
 * @version $Id$
 * 
 */
class Model_Db_Fichario extends Model_Db
{

	protected $_name = 'fichario';
	protected $_primary  = 'id'; //primary key
	protected $_referenceMap	= array(
        'CoberturaVaca' => array(
            'columns'           => array('id'),
            'refTableClass'     => 'Model_Db_Cobertura',
            'refColumns'        => array('fichario_id')
        ),
        'CoberturaTouro' => array(
            'columns'           => array('id'),
            'refTableClass'     => 'Model_Db_Cobertura',
            'refColumns'        => array('touro_id')
        ),
	);

	public function getPaginatorAdapter($orderby = null, $order = null)
	{

		if ($orderby == 'data_nascimento') {
			$orderby = 'dt_nascimento';
		}

		$this->_select
			->from(array($this->_name), array(
				'id',
				'cod',
				'nome',
				'rgn',
				'data_nascimento' => new Zend_Db_Expr("DATE_FORMAT(dt_nascimento, '%d/%m/%Y')"),
			), $this->_schema)
			->joinLeft('local', $this->_name.'.local_id = local.id', array('local_dsc' => 'dsc'), $this->_schema)
			->joinLeft('fazenda', $this->_name.'.fazenda_id = fazenda.id', array('fazenda_dsc' => 'descricao'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;

	}

	/**
	 * Retorna uma array no formato exigido pelo flexigrid
	 * 
	 * @param array|string $cols colunas a serem retornadas
	 * @param string $orderby nome da coluna a ser ordenada
	 * @param string $ordertipo de ordenacao asc ou desc
	 * @param int $page numero da pagina atual
	 * @param int $limit numero de registros por pagina
	 * @param string $qtype nome do campo
	 * @param string $query valor a ser procurado
	 * @param boolean $order true or false for ASC or DESC
	 * @param boolean $like true of false to enable like '%%'
	 * @param array $params
	 * @return array
	 */
	public function listJsonFicharios($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $fazenda_id = false, $like = false, $params = array())
	{

		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select
			->from($this->_name, array('id', 'cod', 'nome', 'rgn', 'sisbov', 'sexo'), $this->_schema)
		;

		if ($orderby && $order) {
			$this->_select->order($orderby .' '. $order);
		}

		if ($qtype && $query) {
			if ($like == 'false') {
				$this->_select->where($qtype .' = ?', $query);
			} else {
				$this->_select->where($qtype .' LIKE ?', '%'.$query.'%');
			}
		}

		if (array_key_exists('sexo', $params) && $params['sexo'] != false) {
			$this->_select->where($this->_name.'.sexo = ?', $params['sexo']);
		}

		$return = array(
			'page' => $page,
			'total' => $this->fetchAll($this->_select)->count(),
		);

		if ($page && $limit) {
			$this->_select->limitPage($page, $limit);
		}

		$array = $this->fetchAll($this->_select)->toArray();
		for ($i=0; $i < count($array); $i++)
		{
			$row = $array[$i];

			$current = array(
				'id' => $row[$col_id]
			);
			foreach ($row as $key => $val)
			{
				if ($key == $col_id) {
					continue;
				} else {
					if ($val == null) {
						$current['cell'][] = '';
					} else {
						$current['cell'][] = ($val);
					}
				}
			}
			$return['rows'][] = $current;
		}
		return $return;

	}

	public function listJsonAnimal($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $params = array())
	{

//		if ($orderby == 'cod') {
//			$orderby = "natsort_canon(`cod`, 'natural')";
//		}
		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select
			->from($this->_name, array('id', 'cod', 'nome', 'rgn', 'sisbov', 'sexo'), $this->_schema)
			->joinLeft(array('categoria'), 'categoria_id = categoria.id', array('categoria' => 'dsc'), $this->_schema)
			->joinLeft(array('raca'), 'raca_id = raca.id', array('raca' => 'dsc'), $this->_schema)
			->joinLeft(array('grausangue'), 'grausangue_id = grausangue.id', array('grausangue' => 'dsc'), $this->_schema)
		;

		if ($orderby && $order) {
			$this->_select->order($orderby .' '. $order);
		}

		if ($qtype && $query) {
			if ($like == 'false') {
				$this->_select->where($qtype .' = ?', $query);
			} else {
				$this->_select->where($qtype .' LIKE ?', '%'.$query.'%');
			}
		}

		if (array_key_exists('sexo', $params) && $params['sexo'] != false) {
			$this->_select->where($this->_name.'.sexo = ?', $params['sexo']);
		}

		$return = array(
			'page' => $page,
			'total' => $this->fetchAll($this->_select)->count(),
		);

		if ($page && $limit) {
			$this->_select->limitPage($page, $limit);
		}

		$array = $this->fetchAll($this->_select)->toArray();
		for ($i=0; $i < count($array); $i++)
		{
			$row = $array[$i];

			$current = array(
				'id' => $row[$col_id]
			);
			foreach ($row as $key => $val)
			{
				if ($key == $col_id) {
					continue;
				} else {
					if ($val == null) {
						$current['cell'][] = '';
					} else {
						$current['cell'][] = ($val);
					}
				}
			}
			$return['rows'][] = $current;
		}
		return $return;
	}

	public function getFicharios($orderby = null, $order = null)
	{
		new Zend_Db_Table_Exception('Deprecated function');
		$this->_select
			->from(array($this->_name), array(
				'id',
				'cod',
				'nome',
				'dt_nascimento' => new Zend_Db_Expr("DATE_FORMAT(dt_nascimento, '%d/%m/%Y')"),
			), $this->_schema)
			->joinLeft('raca', 'f.raca_id = raca.id', array('raca_dsc' => 'dsc'), $this->_schema)
			->joinLeft('local', 'f.local_id = local.id', array('local_dsc' => 'dsc'), $this->_schema)
			->joinLeft('fazenda', 'f.fazenda_id = fazenda.id', array('fazenda_dsc' => new Zend_Db_Expr("SUBSTRING(descricao, 1, 30)")), $this->_schema)
			->order($orderby .' '. $order)
			;

//		die('<pre>'.$this->_select);

		$result = $this->fetchAll($this->_select);
		return $result->toArray();
	}

	public function getFichario($id)
	{
		$id = (int)$id;
		$this->_select
			->from(array($this->_name), array(
				'id',
				'fazenda_id',
				'cod',
				'nome',
				'rgn',
				'sisbov',
				'dt_nascimento' => new Zend_Db_Expr("DATE_FORMAT(".$this->_name.".dt_nascimento, '%d/%m/%Y')"),
				'criador_id',
				'pelagem_id',
				'raca_id',
				'rebanho_id',
				'categoria_id',
				'local_id',
				'grausangue_manual',
				'grausangue_id',
				'sexo',
				'origem',
				'pai_id',
				'mae_id',
				'receptora_id',
				'obs',
			), $this->_schema)
			->joinLeft('criador', $this->_name.'.criador_id = criador.id', array('criador_cod' => 'cod', 'criador' => 'dsc'), $this->_schema)
			->joinLeft('pelagem', $this->_name.'.pelagem_id = pelagem.id', array('pelagem_cod' => 'cod', 'pelagem' => 'dsc'), $this->_schema)
			->joinLeft('raca', $this->_name.'.raca_id = raca.id', array('raca_cod' => 'cod', 'raca' => 'dsc'), $this->_schema)
			->joinLeft('rebanho', $this->_name.'.rebanho_id = rebanho.id', array('rebanho_cod' => 'cod', 'rebanho' => 'dsc'), $this->_schema)
			->joinLeft('categoria', $this->_name.'.categoria_id = categoria.id', array('categoria_cod' => 'cod', 'categoria' => 'dsc'), $this->_schema)
			->joinLeft('local', $this->_name.'.local_id = local.id', array('local_cod' => 'local', 'local' => 'dsc'), $this->_schema)
			->joinLeft('grausangue', $this->_name.'.grausangue_id = grausangue.id', array('grausangue_cod' => 'cod', 'grausangue' => 'dsc'), $this->_schema)
			->joinLeft(array('pai' => 'fichario'), $this->_name.'.pai_id = pai.id', array('pai_cod' => 'cod', 'pai' => 'nome'), $this->_schema)
			->joinLeft(array('mae' => 'fichario'), $this->_name.'.mae_id = mae.id', array('mae_cod' => 'cod', 'mae' => 'nome'), $this->_schema)
			->joinLeft(array('receptora' => 'fichario'), $this->_name.'.receptora_id = receptora.id', array('receptora_cod' => 'cod', 'receptora' => 'nome'), $this->_schema)
			->where($this->_name.'.id = ?', $id)
		;

//		print '<pre>'.$this->_select.'</pre>';
//		die();

		$row = $this->fetchRow($this->_select);
		if (!$row) {
			throw new Zend_Db_Table_Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function updateFichario($post)
	{
		$_dt = explode('/', $post['dt_nascimento']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$posts = array (
			'fazenda_id'		=> $this->_fId,
			'cod'				=> $post['cod'],
			'nome'				=> $post['nome'],
			'rgn'				=> $post['rgn'],
			'sisbov'			=> $post['sisbov'],
			'dt_nascimento'		=> $_dt,
			'criador_id'		=> $post['criador_id'],
			'pelagem_id'		=> $post['pelagem_id'],
			'raca_id'			=> $post['raca_id'],
			'rebanho_id'		=> $post['rebanho_id'],
			'categoria_id'		=> $post['categoria_id'],
			'local_id'			=> $post['local_id'],
			'grausangue_manual' => $post['grausangue_manual'],
			'grausangue_id'		=> $post['grausangue_id'],
			'sexo'				=> $post['sexo'],
			'origem'			=> $post['origem'],
			'pai_id'			=> $post['pai_id'],
			'mae_id'			=> $post['mae_id'],
			'receptora_id'		=> $post['receptora_id'],
			'obs'				=> $post['obs'],
		);

		foreach ($posts as $key => $val) {
			if ($val == '') {
				$data[$key] = null;
			} else {
				$data[$key] = utf8_encode($val);
			}
		}

		$where = 'id = '.(int)$post['id'];
		$this->update($data, $where);
	}

	public function addFichario($post)
	{

		$_dt = explode('/', $post['dt_nascimento']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$posts = array (
			'fazenda_id'		=> $this->_fId,
			'cod'				=> utf8_encode($post['cod']),
			'nome'				=> utf8_encode($post['nome']),
			'rgn'				=> utf8_encode($post['rgn']),
			'sisbov'			=> utf8_encode($post['sisbov']),
			'dt_nascimento'		=> $_dt,
			'criador_id'		=> $post['criador_id'],
			'pelagem_id'		=> $post['pelagem_id'],
			'raca_id'			=> $post['raca_id'],
			'rebanho_id'		=> $post['rebanho_id'],
			'categoria_id'		=> $post['categoria_id'],
			'local_id'			=> $post['local_id'],
			'grausangue_id'		=> $post['grausangue_id'],
			'sexo'				=> $post['sexo'],
			'origem'			=> $post['origem'],
			'pai_id'			=> $post['pai_id'],
			'mae_id'			=> $post['mae_id'],
			'receptora_id'		=> $post['receptora_id'],
			'obs'				=> utf8_encode($post['obs']),
		);

		foreach ($posts as $key => $val) {
			if ($val == '') {
				continue;
			} else {
				$data[$key] = utf8_encode($val);
			}
		}

		if ($this->insert($data)) {
			return true;
		} else {
			return false;
		}

	}

	public function deleteFichario($id)
	{
		$this->delete('id = ' . intval($id));
	}

	public function getGenealogia($id = false)
	{
		if ($id == false) {
			return false;
		}
		$this->_select = $this->select()
			->from(array('f' => $this->_name), array(
				'id',
				'cod',
				'nome',
				'pai_id',
				'mae_id',
			), $this->_schema)
			->where('id = ?', (int)$id)
		;

		$row = $this->fetchRow($this->_select);
		if (!$row) {
			throw new Zend_Db_Table_Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function getFilhos ($id = false)
	{
		if ($id == false) {
			return false;
		}

		$this->_select = $this->select()
			->from($this->_name,array('id', 'cod', 'nome'),$this->_schema)
			->where('pai_id = ? or mae_id = ?', $id)
			->order('dt_nascimento', 'dsc')
			;
		;
		$result = $this->fetchAll($this->_select)->toArray();

		if (count($result) > 0) {
			for ($i=0; $i < count($result); $i++)
			{
				$result[$i]['nome'] = utf8_decode($result[$i]['nome']);
			}
			return $result;
		} else {
			return false;
		}
	}

	public function listJsonAutocomplete($post)
	{
		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, array('value' => 'id', 'caption' => 'nome'), $this->_schema)
		;

		$this->_select->order('nome ASC');

		$this->_select->orWhere($this->_name.'.nome' .' LIKE ?', '%'.$post.'%');
		$this->_select->orWhere($this->_name.'.cod' .' LIKE ?', '%'.$post.'%');
		$this->_select->limitPage(0, 10);

		$array = $this->fetchAll($this->_select)->toArray();
		return $array;
	}

	public function findPreventivoMorte($data)
	{
		if (@$data['cod'] == "" || @$data['fazenda_id'] == "") {
			$return['error'] = 'Parametros incorretos';
		} else {
				$this->_select = $this->select()
				->setIntegrityCheck(false)
				->from(array('f' => $this->_name), array(
					'id',
					'cod',
					'nome',
					'obs',
					'time' => new Zend_Db_Expr('curtime()')
				), $this->_schema)
			;
			if (@$data['byId']) {
				$this->_select->where('f.id = ?', $data['cod']);
			} else {
				$this->_select->where('f.cod = ?', $data['cod']);
			}
			if ($this->fetchAll($this->_select)->count() == 0) {
				$return['error'] = 'Nenhum registro encontrado.';
			} else {
				$return = $this->fetchAll($this->_select)->toArray();
			}
		}
		return $return;
	}

	public function recoverPreventivoMorte($id = false, $time = false)
	{
		if ($id == false && $time == false) {
			$return['error'] = 'Parametros incorretos';
		} else {
				$this->_select = $this->select()
				->setIntegrityCheck(false)
				->from(array('f' => $this->_name), array(
					'id',
					'cod',
					'nome',
					'obs',
					'time' => new Zend_Db_Expr("'".$time."'")
				), $this->_schema)
				->where('f.id = ?', $id)
			;
			if ($this->fetchAll($this->_select)->count() == 0) {
				$__return['error'] = 'Nenhum registro encontrado.';
			} else {
				$__return = $this->fetchRow($this->_select)->toArray();
			}
		}
		foreach ($__return as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function checkMovimentacaoVenda($id)
	{
		$id = (int)$id;
		$row = $this->find($id)->current();
		$movimentos = $row->findDependentRowset('Model_Db_Movimentacao')->toArray();
		foreach ($movimentos as $movimento) {
			if ($movimento['tipo_id'] == 6)
				return false;
		}
		return true;
	}
}
