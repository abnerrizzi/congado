<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Model_Db_Raca extends Model_Db
{

	protected $_name = 'raca';
	protected $_select = false;

//	public function getPaginatorAdapter($orderby = null, $order = null)
//	{
//
//		$select = $this->select()
//			->from($this->_name, array('id', 'cod', 'dsc'), $this->_schema);
//
//		if ($orderby != null && $order != null) {
//			$select->order($orderby .' '. $order);
//		}
//
//		return $select;
//
//	}
//
//	public function getTotalRowCount()
//	{
//
//		$this->_select = $this->select()
//			->from($this->_name, array(Zend_Paginator_Adapter_DbSelect::ROW_COUNT_COLUMN => 'id'));
//
//		$result = ($this->fetchRow($this->_select)->toArray());
//
//		return (int)$result[Zend_Paginator_Adapter_DbSelect::ROW_COUNT_COLUMN];
//
//	}

	public function getRacas($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getRaca($id)
	{
		$id = (int)$id;
		$row = $this->fetchRow('id = ' . $id);
		if (!$row) {
			throw new Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function listRacas($cols = '*', $orderby = false, $order = false, $return_sql = false)
	{

		if (!is_array($cols)) {
			$cols = array($cols);
		}
		$this->_select = $this->select()
			->from($this->_name, $cols);
		if ($orderby && $order) {
			$this->_select()
				->order($orderby .' '. $order)
			;
		}

		if ($return_sql == true) {
			return $this->_select;
		}

		$array = $this->fetchAll($this->_select)->toArray();
		$return = array();
		for ($i=0; $i < count($array); $i++)
		{
			foreach ($array[$i] as $key => $val) {
				$return[$i][$key] = utf8_decode($val);
			}
		}
		return $return;

	}

	/**
	 * Retorna uma array no formato exigido pelo flexigrid
	 * 
	 * @param $cols (array|string) colunas a serem retornadas
	 * @param $orderby (string) nome da coluna a ser ordenada
	 * @param $order (string) tipo de ordenacao asc ou desc
	 * @param $page (int) numero da pagina atual
	 * @param $limit (int) numero de registros por pagina
	 * @param $qtype (string) nome do campo
	 * @param $query (string) valor a ser procurado
	 * @param $type (string) {flexigrid|jqgrid} tipo de formatacao utilizada para retornar
	 */
	public function listRacasJson($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $type = 'flexigrid')
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

		$this->_select = $this->select()
			->from($this->_name, $cols, $this->_schema)
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

		$return = array(
			'page' => $page,
			'total' => $this->fetchAll($this->_select)->count(),
		);

		if ($page && $limit) {
			$this->_select->limitPage($page, $limit);
		}

		$array = $this->fetchAll($this->_select)->toArray();
		if ($type == 'flexigrid') {
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
		} else {
			throw new Exception('erro inesperado no Model_Db_Raca');
		}
		return $return;

	}

	public function updateRaca($post)
	{
		foreach ($post as $key => $val) {
			if ($val == '') {
				$data[$key] = null;
			} else {
				$data[$key] = utf8_encode($val);
			}
		}
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function addRaca($params)
	{

		foreach ($params as $key => $val) {
			if ($val == '') {
				$data[$key] = null;
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

	public function deleteRaca($id)
	{
		$this->delete('id = ' . intval($id));
	}

}