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

	public function getPaginatorAdapter($orderby = null, $order = null)
	{
		if ($orderby == 'dh') {
			$orderby = 'data';
		}
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'dh' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
			), $this->_schema)
			->joinLeft(array('v' => 'fichario'), 'c.fichario_id = v.id', array('vaca' => 'cod'), $this->_schema)
			->joinLeft(array('t' => 'fichario'), 'c.touro_id = t.id', array('touro' => 'cod'), $this->_schema)
			->joinLeft(array('i' => 'inseminador'), 'c.inseminador_id = i.id', array('inseminador' => 'dsc'), $this->_schema)
			->joinLeft(array('l' => 'lote'), 'c.lote_id = l.id', array('lote_dsc' => 'dsc'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}

	public function listJsonCobertura($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $params = array())
	{

		if ($orderby == 'dh') {
			$orderby = 'data';
		}

		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, array('id', 'dh' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')")), $this->_schema)
			->joinLeft(array('vaca' => 'fichario'), 'fichario_id = vaca.id', array('vaca' => 'vaca.cod'), $this->_schema)
			->joinLeft(array('touro' => 'fichario'), 'touro_id = touro.id', array('touro' => 'touro.cod'), $this->_schema)
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
