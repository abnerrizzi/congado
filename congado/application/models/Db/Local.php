<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Local.php 37 2010-01-21 12:31:43Z bacteria_ $
 * 
 */

class Model_Db_Local extends Model_Db
{

	protected $_name = 'local';
	protected $_select = false;

	public function getPaginatorAdapter($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('l' => $this->_name), array('id', 'local', 'dsc', 'area'), $this->_schema)
			->join(array('f' => 'fazenda'), 'f.id = l.fazenda_id', array('fazenda' => 'descricao'), $this->_schema)
			->order($orderby .' '. $order)
			;
		return $this->_select;
	}

	public function getLocais($orderby = null, $order = null)
	{
		$query = $this->select()
			->setIntegrityCheck(false)
			->from(array('l' => $this->_name), array('*'), $this->_schema)
			->join(array('f' => 'fazenda'), 'f.id = l.fazenda_id', array('fazenda' => 'descricao'), $this->_schema)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getLocal($id)
	{
		$id = (int)$id;
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('l' => $this->_name), array('*'), $this->_schema)
			->join(array('f' => 'fazenda'), 'l.fazenda_id = f.id', array('fazenda_id' => 'id'))
			->where('l.id = ?', $id)
		;
		$row = $this->fetchRow($this->_select);
		if (!$row) {
			throw new Exception("Could not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

/**
	 * 
	 * @param $fields array()
	 */
	public function listLocais($cols = '*')
	{

		if (!is_array($cols)) {
			$cols = array($cols);
		}
		$this->_select = $this->select()
			->from($this->_name, $cols);
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
	 */
	public function listJsonLocal($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $fazenda_id = false, $like = false)
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
			->setIntegrityCheck(false)
			->join(array('f' => 'fazenda'), 'fazenda_id = f.id', array('fazenda_dsc' => 'descricao'), $this->_schema)
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

		if ($fazenda_id) {
			$this->_select->where('f.id = ?', (int)$fazenda_id);
		} else {
			$this->_select->where('1 = ?', 2);
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

	public function updateLocal($post)
	{

		$data = array (
			'fazenda_id' => intval($post['fazenda_id']),
			'local'		 => utf8_encode($post['local']),
			'dsc'		 => utf8_encode($post['dsc']),
			'area'		 => $post['area'],
		);

		if (intval($data['area']) == 0) {
			unset($data['area']);
		}

		$where = 'id = '.intval($post['id']);
		$return = $this->update($data, $where);

	}

	public function addLocal($fazenda_id, $local, $dsc, $area)
	{

		$data = array(
			'fazenda_id' => utf8_encode($fazenda_id),
			'local'		 => utf8_encode($local),
			'dsc'		=> utf8_encode($dsc),
			'area'		 => $area,
		);

		if ($data['area'] == '') {
			unset($data['area']);
		}

		$result = $this->insert($data);
		return true;
	}

	public function deleteLocal($id)
	{
		$this->delete('id = ' . intval($id));
	}


}