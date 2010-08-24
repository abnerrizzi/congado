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
class Model_Db_ColetaEmbriao extends Model_Db
{

	protected $_name = 'coletaembriao';
	protected $_select = false;

	public function getPaginatorAdapter($orderby = null, $order = null)
	{

		if ($orderby == 'data_coleta') {
			$orderby = 'dt_coleta';
		}

		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'data_coleta' => new Zend_Db_Expr("DATE_FORMAT(dt_coleta, '%d/%m/%Y')"),
			), $this->_schema)
			->joinLeft(array('fv' => 'fichario'), 'c.vaca_id = fv.id', array('vaca_cod' => 'cod', 'vaca_nome' => 'nome'), $this->_schema)
			->joinLeft(array('ft' => 'fichario'), 'c.touro_id = ft.id', array('touro_cod' => 'cod', 'touro_nome' => 'nome'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}

	public function getColetaEmbriao($id)
	{
		$id = (int)$id;
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, '*', $this->_schema)
			->joinLeft(array('vaca' => 'fichario'), 'vaca_id = vaca.id',array('vaca_cod' => 'cod', 'vaca' => 'nome'),$this->_schema)
			->joinLeft(array('touro' => 'fichario'), 'touro_id = touro.id',array('touro_cod' => 'cod', 'touro' => 'nome'),$this->_schema)
			->where($this->_name.'.id = ?', (int)$id)
			;
//		die('<pre>'.$this->_select);
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

	public function updateColeta($post)
	{
		Zend_Debug::dump($post);
		die('vai alterar');
	}

	public function addColeta($post)
	{
		unset(
			$post['vaca_cod'],
			$post['vaca'],
			$post['touro_cod'],
			$post['touro'],
			$post['id'],
			$post['obs']
		);

		$_datas = array(
			'dt_coleta',
			'trata_inicio',
			'trata_final',

		);
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
			if (in_array($key, $_datas) && $val != NULL) {
				$x = explode('/', $val);
				$val = $x[2] .'-'. $x[1] .'-'. $x[0];
			}
			$return[$key] = utf8_decode($val);
		}

		/*
		 * funcao q remove apenas o ultimo caractere da string
		 * substr($qwe, 0, -1);
		 */
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
			}
		}

		foreach ($return as $key => $val) {
			if (is_int($val) && $val <= 0) {
				$return[$key] = null;
			} elseif ($val == "") {
				$return[$key] = null;
			}
		}

		$insert = $this->insert($return);
		Zend_Debug::dump($insert);
		die('Model_Db_ColetaEmbriao->addColeta()');
	}


	public function listJsonColetaEmbriao($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $params = array())
	{

		if ($orderby == 'data_coleta') {
			$orderby = 'dt_coleta';
		}

		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'vaca_cod' => 'fv.cod',
				'data_coleta' => new Zend_Db_Expr("DATE_FORMAT(dt_coleta, '%d/%m/%Y')"),
				'touro_cod' => 'ft.cod',
				'fecundada',
				'nao_viavel',
			), $this->_schema)
			->joinLeft(array('fv' => 'fichario'), 'c.vaca_id = fv.id', array(), $this->_schema)
			->joinLeft(array('ft' => 'fichario'), 'c.touro_id = ft.id', array(), $this->_schema)
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
}
