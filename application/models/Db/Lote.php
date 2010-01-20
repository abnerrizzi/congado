<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Model_Db_Lote extends Model_Db
{

	protected $_name = 'lote';
	protected $_select = false;

	public function getPaginatorAdapter($orderby, $order)
	{
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('l' => $this->_name), array('id', 'cod', 'dsc'), $this->_schema)
			->join(array('f' => 'fazenda'), 'f.id = l.fazenda_id', array('fazenda' => 'descricao'), $this->_schema)
			->order($orderby .' '. $order)
			;
//			print '<pre>'.$this->_select;
//			die();
		return $this->_select;
	}

	public function getLotes($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('l' => $this->_name), array('*'), $this->_schema)
			->join(array('f' => 'fazenda'), 'f.id = l.fazenda_id', array('fazenda' => 'descricao'), $this->_schema)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($this->_select);
		return $result->toArray();
	}

	public function addLote($fazenda_id, $cod, $dsc)
	{

		$data = array(
			'fazenda_id' => utf8_encode($fazenda_id),
			'cod'		=> utf8_encode($cod),
			'dsc'		=> utf8_encode($dsc),
		);

		$result = $this->insert($data);
		return true;
	}

	public function getLote($id)
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

	public function updateLote($post)
	{

		$data = array (
			'dsc'		 => utf8_encode($post['dsc']),
		);

		$where = 'id = '.intval($post['id']);
		$return = $this->update($data, $where);

	}

	public function deleteLote($id)
	{
		$this->delete('id = ' . intval($id));
	}

}