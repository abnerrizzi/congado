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
class Model_Db_Cobertura extends Model_Db
{

	protected $_name = 'cobertura';
	protected $_select = false;
	protected $_dependentTables = array(
		'Model_Db_Lote',
		'Model_Db_Inseminador',
		'Model_Db_Fichario',
		'Model_Db_Fazenda',
	);
	/*
	protected $_referenceMap	= array(
		'fazenda' => array(
            'columns'           => array('fazenda_id'),
            'refTableClass'     => 'Model_Db_Fazenda',
            'refColumns'        => array('id')
        ),
        'vaca' => array(
            'columns'           => array('fichario_id'),
            'refTableClass'     => 'Model_Db_Fichario',
            'refColumns'        => array('id')
        ),
        'touro' => array(
            'columns'           => array('touro_id'),
            'refTableClass'     => 'Model_Db_Fichario',
            'refColumns'        => array('id')
        ),
	);
	*/

	public function getPaginatorAdapter($orderby = null, $order = null)
	{
		if ($orderby == 'dh') {
			$orderby = 'dt_cobertura';
		}
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'dh' => new Zend_Db_Expr("DATE_FORMAT(dt_cobertura, '%d/%m/%Y')"),
			), $this->_schema)
			->joinLeft(array('v' => 'fichario'), 'c.fichario_id = v.id', array('vaca' => 'cod'), $this->_schema)
			->joinLeft(array('t' => 'fichario'), 'c.touro_id = t.id', array('touro' => 'cod'), $this->_schema)
			->joinLeft(array('i' => 'inseminador'), 'c.inseminador_id = i.id', array('inseminador' => 'dsc'), $this->_schema)
			->joinLeft(array('l' => 'lote'), 'c.lote_id = l.id', array('lote_dsc' => 'dsc'), $this->_schema)
			->joinLeft(array('tipo' => 'cobertura_tipo'), 'c.cobertura_tipo_id = tipo.id', array('tipo' => 'tipo.cod'), $this->_schema)
			->where('tipo.cod IN (?)', array('C', 'I', 'M'))
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}

	public function getPaginatorAdapterRegime($orderby = null, $order = null)
	{
		if ($orderby == 'dhi') {
			$orderby = 'dt_cobertura';
		} elseif ($orderby == 'dhf') {
			$orderby = 'dataCio';
		}
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'vaca' => 'vaca.cod',
				'vaca_fazenda_id' => 'fazenda_id',
				'dhi' => new Zend_Db_Expr("DATE_FORMAT(dt_cobertura, '%d/%m/%Y')"),
				'dhf' => new Zend_Db_Expr("DATE_FORMAT(dataCio, '%d/%m/%Y')"),
				'touro' => 'touro.cod',
				'numerocobertura'
			), $this->_schema)
			->joinLeft(array('vaca' => 'fichario'), 'fichario_id = vaca.id', array(), $this->_schema)
			->joinLeft(array('touro' => 'fichario'), 'touro_id = touro.id', array(), $this->_schema)
			->joinLeft(array('tipo' => 'cobertura_tipo'), 'cobertura_tipo_id = tipo.id', array(), $this->_schema)
			
//			->joinLeft(array('v' => 'fichario'), 'c.fichario_id = v.id', array('vaca' => 'cod'), $this->_schema)
//			->joinLeft(array('t' => 'fichario'), 'c.touro_id = t.id', array('touro' => 'cod'), $this->_schema)
//			->joinLeft(array('i' => 'inseminador'), 'c.inseminador_id = i.id', array('inseminador' => 'dsc'), $this->_schema)
//			->joinLeft(array('l' => 'lote'), 'c.lote_id = l.id', array('lote_dsc' => 'dsc'), $this->_schema)
//			->joinLeft(array('tipo' => 'cobertura_tipo'), 'c.cobertura_tipo_id = tipo.id', array(), $this->_schema)
			->where('tipo.cod = ?', 'R')
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}

	public function listJsonCobertura($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $params = array())
	{

		if ($orderby == 'dh') {
			$orderby = 'dt_cobertura';
		}

		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, array(
				'id',
				'dh' => new Zend_Db_Expr("DATE_FORMAT(dt_cobertura, '%d/%m/%Y')"),
				'vaca' => 'vaca.cod',
				'touro' => 'touro.cod',
				'numerocobertura'
			), $this->_schema)
			->joinLeft(array('vaca' => 'fichario'), 'fichario_id = vaca.id', array(), $this->_schema)
			->joinLeft(array('touro' => 'fichario'), 'touro_id = touro.id', array(), $this->_schema)
			->where('tipo IN (?)', array('C', 'I', 'M'))
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

	public function listJsonRegime($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $params = array())
	{

		if ($orderby == 'dhi') {
			$orderby = 'dt_cobertura';
		} elseif ($orderby == 'dhf') {
			$orderby = 'dataCio';
		}

		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, array(
				'id',
				'vaca' => 'vaca.cod',
				'dhi' => new Zend_Db_Expr("DATE_FORMAT(dt_cobertura, '%d/%m/%Y')"),
				'dhf' => new Zend_Db_Expr("DATE_FORMAT(dataCio, '%d/%m/%Y')"),
				'touro' => 'touro.cod',
				'numerocobertura',
				'vaca_fazenda_id'	=> 'fazenda_id',
			), $this->_schema)
			->joinLeft(array('vaca' => 'fichario'), 'fichario_id = vaca.id', array(), $this->_schema)
			->joinLeft(array('touro' => 'fichario'), 'touro_id = touro.id', array(), $this->_schema)
			->joinLeft(array('tipo' => 'cobertura_tipo'), 'cobertura_tipo_id = tipo.id', array(), $this->_schema)
			->where('tipo.cod = ?', 'R')
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

	public function getCobertura($id)
	{

		$id = (int)$id;

		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'fazenda_id',
				'dt_cobertura' => new Zend_Db_Expr("DATE_FORMAT(dt_cobertura, '%d/%m/%Y')"),
				'numerocobertura',
			), $this->_schema)
			->joinLeft(array('v' => 'fichario'), 'c.fichario_id = v.id', array('vaca_id' => 'v.id', 'vaca_cod' => 'v.cod', 'vaca' => 'nome'), $this->_schema)
			->joinLeft(array('t' => 'fichario'), 'c.touro_id = t.id', array('touro_id' => 't.id', 'touro_cod' => 't.cod', 'touro' => 'nome'), $this->_schema)
			->joinLeft(array('i' => 'inseminador'), 'c.inseminador_id = i.id', array('inseminador_id' => 'i.id', 'inseminador_cod' => 'i.cod', 'inseminador' => 'i.dsc'), $this->_schema)
			->joinLeft(array('l' => 'lote'), 'c.lote_id = l.id', array('lote_id' => 'l.id', 'lote_cod' => 'l.cod', 'lote' => 'l.dsc'), $this->_schema)
			->joinLeft(array('tipo' => 'cobertura_tipo'), 'c.cobertura_tipo_id = tipo.id', array('tipo' => 'tipo.dsc', 'tipo_cod' => 'tipo.cod'), $this->_schema)
			->where('tipo.cod IN (?)', array('C', 'I', 'M'))
			->where('c.id = ?', $id)
			;

		$row = $this->fetchRow($this->_select);

		if (!$row) {
			throw new Exception("Count not find row $id");
		} elseif (!(($row['tipo_cod'] == 'C') || ($row['tipo_cod'] == 'I') || ($row['tipo_cod'] == 'M'))) {
			throw new Zend_Db_Exception("Tipo diferente (". $row['tipo'] .")");
		} 
		$array = $row->toArray();

		if ($array['numerocobertura'] != NULL) {
			$_last = $this->select()
				->setIntegrityCheck(false)
				->from(array('c' => $this->_name), array(
					'ultima_cobertura' => new Zend_Db_Expr("DATE_FORMAT(dt_cobertura, '%d/%m/%Y')"),
				), $this->_schema)
				->where('c.fichario_id = ?', $array['vaca_id'])
				->where('c.fazenda_id = ?', $array['fazenda_id'])
				->where('c.dt_cobertura <= STR_TO_DATE(?, \'%d/%m/%y\')', $array['dt_cobertura'])
				->where('c.numerocobertura < ?', $array['numerocobertura'])
				->joinLeft(array('tipo' => 'cobertura_tipo'), 'c.cobertura_tipo_id = tipo.id', array('ultima_tipo' => 'tipo.dsc'), $this->_schema)
				->order('dt_cobertura DESC')
			;

			$_lastRow = $this->fetchRow($_last);
			if ($_lastRow != NULL) {
				$_lastRow = $_lastRow->toArray();
			}

			$array['ultima_cobertura'] = $_lastRow['ultima_cobertura'];
			$array['ultima_tipo'] = $_lastRow['ultima_tipo'];
		}

		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function getRegime($id)
	{

		$id = (int)$id;

		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'fazenda_id',
				'dt_cobertura' => new Zend_Db_Expr("DATE_FORMAT(dt_cobertura, '%d/%m/%Y')"),
				'numerocobertura',
				'tipo',
			), $this->_schema)
			->joinLeft(array('v' => 'fichario'), 'c.fichario_id = v.id', array('vaca_id' => 'v.id', 'vaca_cod' => 'v.cod', 'vaca' => 'nome'), $this->_schema)
			->joinLeft(array('t' => 'fichario'), 'c.touro_id = t.id', array('touro_id' => 't.id', 'touro_cod' => 't.cod', 'touro' => 'nome'), $this->_schema)
			->joinLeft(array('i' => 'inseminador'), 'c.inseminador_id = i.id', array('inseminador_id' => 'i.id', 'inseminador_cod' => 'i.cod', 'inseminador' => 'i.dsc'), $this->_schema)
			->joinLeft(array('l' => 'lote'), 'c.lote_id = l.id', array('lote_id' => 'l.id', 'lote_cod' => 'l.cod', 'lote' => 'l.dsc'), $this->_schema)
//			->where('tipo IN (?)', array('C', 'I', 'M'))
			->where('c.id = ?', $id)
			;

		$row = $this->fetchRow($this->_select);
		if (!$row) {
			throw new Exception("Count not find row $id");
		} elseif (!(($row['tipo'] == 'R'))) {
			throw new Zend_Db_Exception("Tipo diferente (". $row['tipo'] .")");
		} 
		$array = $row->toArray();

		if ($array['numerocobertura'] != NULL) {
			$_last = $this->select()
				->setIntegrityCheck(false)
				->from(array('c' => $this->_name), array(
					'ultima_cobertura' => new Zend_Db_Expr("DATE_FORMAT(dt_cobertura, '%d/%m/%Y')"),
					'ultima_tipo' => 'tipo',
				), $this->_schema)
				->where('c.fichario_id = ?', $array['vaca_id'])
				->where('c.fazenda_id = ?', $array['fazenda_id'])
				->where('c.dt_cobertura <= STR_TO_DATE(?, \'%d/%m/%y\')', $array['dt_cobertura'])
				->where('c.numerocobertura < ?', $array['numerocobertura'])
				->order('dt_cobertura DESC')
			;

			$_lastRow = $this->fetchRow($_last);
			if ($_lastRow != NULL) {
				$_lastRow = $_lastRow->toArray();
			}

			$array['ultima_cobertura'] = $_lastRow['ultima_cobertura'];
			$array['ultima_tipo'] = $_lastRow['ultima_tipo'];
		}

		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

}
