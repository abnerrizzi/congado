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
class Model_Db_Examerep extends Model_Db
{

	protected $_name = 'examerep';
	protected $_select = false;

	public function listJson($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false)
	{

		if ($orderby == 'dt') {
			$orderby = 'data';
		}

		$col_id = 'id';

		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('e' => $this->_name), array(
				'id',
				'dt' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
//				'fichario_id',
//				'acompanhamento_id'
			), $this->_schema)
			->joinLeft(array('f' => 'fichario'), 'e.fichario_id = f.id', array('cod'), $this->_schema)
			->joinLeft(array('a' => 'acompanhamento'), 'e.acompanhamento_id = a.id', array('acompanhamento' => 'dsc'), $this->_schema)
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

	public function getPaginatorAdapter($orderby = null, $order = null)
	{
		if ($orderby == 'dt') {
			$orderby = 'data';
		}
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('e' => $this->_name), array(
				'id',
				'dt' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
				'obs',
			), $this->_schema)
			->joinLeft(array('f' => 'fichario'), 'e.fichario_id = f.id', array('cod', 'nome'), $this->_schema)
			->joinLeft(array('a' => 'acompanhamento'), 'e.acompanhamento_id = a.id', array('acompanhamento' => 'dsc'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}

	public function getInseminadores($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($this->_select);
		return $result->toArray();
	}

	public function getExame($id)
	{
		$id = (int)$id;

		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('e' => $this->_name), array(
				'id',
				'fazenda_id',
				'fichario_id',
				'data' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
				'acompanhamento_id',
				'obs',
			), $this->_schema)
			->joinLeft('fichario', 'e.fichario_id = fichario.id', array('fichario_cod' => 'cod', 'fichario' => 'nome'), $this->_schema)
			->joinLeft('acompanhamento', 'e.acompanhamento_id = acompanhamento.id', array('acompanhamento_cod' => 'cod', 'acompanhamento' => 'dsc'), $this->_schema)
			->where('e.id = ?', $id)
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

	public function updateExame($post)
	{

		$_dt = explode('/', $post['data']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$data = array(
			'obs' => utf8_encode($post['obs'])
		);

		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where);
	}

	public function addExame($fazenda = false, $fichario = false, $data = false, $acompanhamento = false, $obs = false)
	{
		$_dt = explode('/', $data);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		if ($fazenda && $fichario && $data && $acompanhamento) {
			$data = array(
				'fazenda_id' => intval($fazenda),
				'fichario_id' => intval($fichario),
				'data' => $_dt,
				'acompanhamento_id' => intval($acompanhamento),
				'obs' => utf8_encode($obs),
			);
			if ($this->insert($data)) {
				return true;
			} else {
				return false;
			}
		} else {
			throw new Zend_Db_Table_Exception('Parametros insuficientes.');
		}
	}

	public function deleteExame($id)
	{
		$this->delete('id = ' . intval($id));
	}

}
