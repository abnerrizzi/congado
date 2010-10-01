<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Db
 * @version $Id: Coletaembriao.php 372 2010-08-04 18:09:09Z bacteria_ $
 * 
 */
class Model_Db_EstoqueEmbriao extends Model_Db
{

	protected $_name = 'estoqueembriao';
	protected $_select = false;

	public function getPaginatorAdapter($orderby = null, $order = null)
	{

		if ($orderby == 'data_coleta') {
			$orderby = 'dt_coleta';
		// ordenacao natural
//		} elseif ($orderby == 'embriao') {
//			$orderby = "natsort_canon(`embriao`, 'natural')";
		}

		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('e' => $this->_name), array(
				'id',
				'embriao',
				'data_coleta' => new Zend_Db_Expr("DATE_FORMAT(dt_coleta, '%d/%m/%Y')"),
			), $this->_schema)
			->joinLeft(array('fv' => 'fichario'), 'e.doadora_id = fv.id', array('vaca_cod' => 'cod', 'vaca_nome' => 'nome'), $this->_schema)
			->joinLeft(array('ft' => 'fichario'), 'e.touro_id = ft.id', array('touro_cod' => 'cod', 'touro_nome' => 'nome'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}

	public function getEstoqueEmbriao($id)
	{
		$id = (int)$id;
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, '*', $this->_schema)
			->joinLeft(array('doadora' => 'fichario'), $this->_name.'.doadora_id = doadora.id',array('doadora_id' => 'id', 'doadora_cod' => 'cod', 'doadora' => 'nome'),$this->_schema)
			->joinLeft(array('touro' => 'fichario'), $this->_name.'.touro_id = touro.id',array('touro_cod' => 'cod', 'touro' => 'nome'),$this->_schema)
			->joinLeft(array('criador' => 'criador'), $this->_name.'.criador_id = criador.id',array('criador_cod' => 'cod', 'criador' => 'dsc'),$this->_schema)
			->where($this->_name.'.id = ?', (int)$id)
			;
		$row = $this->fetchRow($this->_select);
		if (!$row) {
			throw new Exception("Count not find row $id");
		}
		$array = $row->toArray();
		$_datas = array(
			'dt_coleta',
			'trata_inicio',
			'trata_final',
		);
		$_dh = array(
			'prost_dh',
			'gnrh_dh',
			'insemina_dh1',
			'insemina_dh2',
			'insemina_dh3',
			'insemina_dh4',
		);
		foreach ($array as $key => $val) {
			if (in_array($key, $_datas) && $val != NULL) {
				$val = date('d/m/Y', strtotime($val));
			} elseif (in_array($key, $_dh) && $val != NULL) {
				$return[$key.'d'] = date('d/m/Y', strtotime($val));
				$return[$key.'h'] = date('H:i', strtotime($val));
			}
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function updateEstoque($post)
	{
		if (!array_key_exists('sexo', $post)) {
			$post['sexo'] = NULL;
		}
		$_dt = explode('/', $post['dt_coleta']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$posts = array(
			'dt_coleta'			=> $_dt,
			'doadora_id'		=> $post['doadora_id'],
			'touro_id'			=> $post['touro_id'],
			'classificacao'		=> utf8_encode($post['classificacao']),
			'grau'				=> utf8_encode($post['grau']),
			'criador_id'		=> $post['criador_id'],
			'sexo'				=> $post['sexo'],
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

	public function addEstoque($post)
	{
		if (!array_key_exists('sexo', $post)) {
			$post['sexo'] = NULL;
		}
		$_dt = explode('/', $post['dt_coleta']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$posts = array (
			'embriao'			=> utf8_encode($post['embriao']),
			'dt_coleta'			=> $_dt,
			'doadora_id'		=> $post['doadora_id'],
			'touro_id'			=> $post['touro_id'],
			'classificacao'		=> utf8_encode($post['classificacao']),
			'grau'				=> utf8_encode($post['grau']),
			'criador_id'		=> $post['criador_id'],
			'sexo'				=> $post['sexo'],
		);

		foreach ($posts as $key => $val) {
			if ($val == '') {
				$data[$key] = NULL;
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

	public function addEmbrioes(array $embrioes)
	{
		foreach ($embrioes as $embriao)
		{
			foreach ($embriao as $key => $val) {
				if ($val == '') {
					$row[$key] = NULL;
				} else {
					$row[$key] = utf8_encode($val);
				}
				if ($key == 'embriao') {
					$__cod[] = $val;
				}
			}
			$data[] = $row;
			unset($row);
		}

		$query_cnt = $this->select()->from($this->_name, array('cnt' => new Zend_Db_Expr('count(id)')), $this->_schema);
		foreach ($__cod as $cod)
		{
			$query_cnt->orWhere('embriao = ?', $cod);
		}
		$x = $this->fetchRow($query_cnt)->toArray();
		if ($x['cnt'] > 0) {
			throw new Zend_Db_Exception('Foi encontrado um embriao com um dos códigos informados');
		} else {
			foreach ($data as $row) {
//				print '<pre>';
//				print_r($row);
//				print '</pre>';
//				die();

				if ($this->insert($row)) {
					continue;
				} else {
					return false;
				}
			}
			return true;
		}
		die("\n\n-- OK --");
	}

	public function deleteEstoque($id)
	{
		$this->delete('id = ' . intval($id));
	}

	public function listJsonEstoqueEmbriao($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $params = array())
	{

		if ($orderby == 'data_coleta') {
			$orderby = 'dt_coleta';
		} elseif ($orderby == 'embriao') {
			$orderby = "natsort_canon(`embriao`, 'natural')";
		}

		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('e' => $this->_name), array(
				'id',
				'embriao',
				'doadora_cod' => 'fv.cod',
				'data_coleta' => new Zend_Db_Expr("DATE_FORMAT(dt_coleta, '%d/%m/%Y')"),
				'touro_cod' => 'ft.cod',
			), $this->_schema)
			->joinLeft(array('fv' => 'fichario'), 'e.doadora_id = fv.id', array(), $this->_schema)
			->joinLeft(array('ft' => 'fichario'), 'e.touro_id = ft.id', array(), $this->_schema)
			->order($orderby .' '. $order)
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

//		print '<pre>'.$this->_select;
//		die();
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

	public function listJsonUltimo($id)
	{
		$id = (int)$id;
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, array('embriao'), $this->_schema)
			->joinLeft(array('doadora' => 'fichario'), $this->_name.'.doadora_id = doadora.id',array(),$this->_schema)
			->where('doadora.id = ?', (int)$id)
			->order('dt_coleta desc')
			->order('embriao desc')
			->limit(1)
			;
//		die('<pre>'.$this->_select);
		$row = $this->fetchRow($this->_select);
		if (!$row) {
			$row['embriao'] = '';
			return $row;
//			throw new Exception("Count not find row $id");
		}
		return $row->toArray();
	}

	public function getByColeta($coletaId)
	{
		$_cols = array(
			'embriao',
			'classificacao',
			'grau',
		);
		$id = (int)$coletaId;
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('e' => $this->_name), $_cols, $this->_schema)
			->joinRight(array('c' => 'coletaembriao'),
				'e.doadora_id = c.vaca_id and e.touro_id = c.touro_id and e.dt_coleta = c.dt_coleta',
				array(), $this->_schema)
			->joinLeft('criador', 'e.criador_id = criador.id', array('criador_cod' => 'cod'),$this->_schema)
			->where('c.id = ?', $id)
			->order("natsort_canon(`embriao`, 'natural')")
			;
		$return = array();
		$i = 0;
		$resutls = $this->fetchAll($this->_select)->toArray();
		foreach ($resutls as $row) {
			$is_numeric = false;
			foreach ($row as $key => $val) {
				if ($key == 'embriao') {
					for ($index = 0; $index < strlen($val); $index++) {
						if (is_numeric(substr($val, $index, 1))) {
							$codAtual = substr($val, 0, ($index-1));
							break;
						}
					}
				}
				$return[$i][$key] = utf8_encode($val);
			};
			$i++;
		}

		foreach ($return as $row => $array) {
			$temp[$row] = $array['embriao'];
		}

		return $return;

	}

	private function sortByNaturalOrder($results, $fieldNameInArray)
	{
		foreach ($results as $row => $array) {
			$temp[$row] = $array[$fieldNameInArray];
		}
		usort($temp, 'strnatcmp');
		
		return $results;
	}
}
