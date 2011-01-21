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
class Model_Db_Diagnostico extends Model_Db
{

	protected $_name = 'diagnostico';

	public function getPaginatorAdapter($orderby = null, $order = null, $cols = '*')
	{

		if ($orderby == 'data') {
			$orderby = 'dt_diagnostico';
		} elseif ($orderby == 'diag') {
			$orderby = 'prenha';
		}

		if (!is_array($cols)) {
			$cols = array($cols);
		}

		$this->_select
			->from($this->_name, array(
				'id',
				'data' => new Zend_Db_Expr("DATE_FORMAT (dt_diagnostico, '%d/%m/%Y')"),
				'diag' => new Zend_Db_Expr("IF (prenha = 1, 'Prenha', 'Vazia')"),
			), $this->_schema)
			->joinLeft('fichario', $this->_name.'.fichario_id = fichario.id', array('vaca_cod' => 'cod', 'vaca' => 'nome'),$this->_schema)
		;

		if ($orderby != null && $order != null) {
			$this->_select->order($orderby .' '. $order);
		}

		return $this->_select;

	}

	public function getDiagnosticos($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getDiagnostico($id)
	{
		$id = (int)$id;
		$row = $this->fetchRow('id = ' . $id);
		if (!$row) {
			throw new Zend_Db_Table_Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function listJson($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false)
	{

		// se for string convert para array
		if (!is_array($cols)) {
			$cols = array($cols);
		}

		// verifica se existe uma coluna chamada ID
		foreach ($cols as $col) {
			if ($col == 'id') {
				$col_id = $col;
			}
		}

		// se nao existir uma coluna chamada ID ... cria a mesma
		if (!$col_id) {
			$col_id = 'id';
			$cols[] = $col_id;
		}

		$this->_select
			->from($this->_name, array(
				'id',
				'v.cod',
				'v.nome',
				'data' => new Zend_Db_Expr("DATE_FORMAT (dt_diagnostico, '%d/%m/%Y')"),
				'diag' => new Zend_Db_Expr("IF (prenha = 1, 'Prenha', 'Vazia')"),
			), $this->_schema)
			->joinLeft(array('v' => 'fichario'), $this->_name.'.fichario_id = v.id', array(),$this->_schema)
		;

		if ($orderby && $order) {
			$this->_select->order($orderby .' '. $order);
		}

		if ($qtype && $query) {
			if ($like == 'false' || $like == false) {
				$this->_select->where($qtype .' = ?', $query);
			} else {
				$this->_select->where($qtype .' LIKE ?', '%'.$query.'%');
			}
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
					$current['cell'][] = ($val);
				}
			}
			$return['rows'][] = $current;
		}
		return $return;

	}

}