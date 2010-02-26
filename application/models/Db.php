<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Model_Db
 * @version $Id$
 * 
 */
class Model_Db extends Zend_Db_Table_Abstract
{

	public function init()
	{
		$db = Zend_Registry::get('database');
		$db = $db->getConfig();
		$this->_schema = $db['dbname'];
	}

	public function getPaginatorAdapter($orderby = null, $order = null, $cols = '*')
	{

		if (!is_array($cols)) {
			$cols = array($cols);
		}

		$select = $this->select()
			->from($this->_name, $cols, $this->_schema);

		if ($orderby != null && $order != null) {
			$select->order($orderby .' '. $order);
		}

		return $select;

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
	 */
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