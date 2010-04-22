<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Db
 * @version $Id: Inseminador.php 105 2010-03-01 14:11:12Z bacteria_ $
 * 
 */
class Model_Db_Examerep extends Model_Db
{

	protected $_name = 'examerep';
	protected $_select = false;

	public function getPaginatorAdapter($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('e' => $this->_name), array(
				'id',
				'data' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
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

	public function getInseminador($id)
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

	public function updateInseminador($post)
	{
		$data = array(
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc'])
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function addInseminador($cod, $dsc)
	{

		$data = array(
			'cod' => utf8_encode($cod),
			'dsc' => utf8_encode($dsc)
		);

		if ($this->insert($data)) {
			return true;
		} else {
			return false;
		}

	}

	public function deleteInseminador($id)
	{
		$this->delete('id = ' . intval($id));
	}

}