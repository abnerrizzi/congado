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

	public function getPaginatorAdapter($orderby = null, $order = null)
	{

		if ($orderby == 'data_coleta') {
			$orderby = 'dt_coleta';
		}

		$this->_select
			->setIntegrityCheck(false)
			->from(array($this->_name), array(
				'id',
				'data_coleta' => new Zend_Db_Expr("DATE_FORMAT(dt_coleta, '%d/%m/%Y')"),
			), $this->_schema)
			->joinLeft(array('fv' => 'fichario'), $this->_name.'.vaca_id = fv.id', array('vaca_cod' => 'cod', 'vaca_nome' => 'nome'), $this->_schema)
			->joinLeft(array('ft' => 'fichario'), $this->_name.'.touro_id = ft.id', array('touro_cod' => 'cod', 'touro_nome' => 'nome'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}

	public function listJsonColeta($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $params = array())
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
			->from(array($this->_name), array(
				'id',
				'data_coleta' => new Zend_Db_Expr('date_format(dt_coleta, "%d/%m/%Y")'),
				'vaca' => 'v.cod',
				'touro' => 't.cod',
				'fecundada',
				'viavel',
			), $this->_schema)
			->joinLeft(array('v' => 'fichario'), $this->_name.'.vaca_id = v.id',array(),$this->_schema)
			->joinLeft(array('t' => 'fichario'), $this->_name.'.touro_id = t.id',array(),$this->_schema)
			->order($orderby .' '. $order)
		;


		if ($qtype && $query) {
			if ($like == 'false' || $like == '') {
				$this->_select->where($qtype .' = ?', $query);
			} else {
				$this->_select->where($qtype .' LIKE ?', '%'.$query.'%');
			}
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
			throw new Zend_Db_Table_Exception("Count not find row $id");
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
			'cio_dh',
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

		print '<pre>';
		print_r($post);
		print '</pre>';
		$where = 'id = '.(int)$post['id'];
		$this->update($post , $where);

	}

	public function addColeta($post)
	{

		if ($this->insert($post)) {
			return true;
		} else {
			throw new Zend_Db_Exception('Erro inesperando.');
			return false;
		}

	}

	public function deleteColeta($id)
	{
		$this->delete('id = ' . intval($id));
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
			->from(array($this->_name), array(
				'id',
				'vaca_cod' => 'fv.cod',
				'data_coleta' => new Zend_Db_Expr("DATE_FORMAT(dt_coleta, '%d/%m/%Y')"),
				'touro_cod' => 'ft.cod',
				'fecundada',
				'nao_viavel',
			), $this->_schema)
			->joinLeft(array('fv' => 'fichario'), $this->_name.'.vaca_id = fv.id', array(), $this->_schema)
			->joinLeft(array('ft' => 'fichario'), $this->_name.'.touro_id = ft.id', array(), $this->_schema)
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
