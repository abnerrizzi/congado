<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Model_Db_Rebanho extends Model_Db
{

	protected $_name = 'rebanho';
	protected $_select = false;

	public function getRebanhos($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getRebanho($id)
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

	/**
	 * 
	 * @param $fields array()
	 */
	public function listRebanhos($cols = '*')
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

	public function updateRebanho($post)
	{
		$data = array(
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc'])
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function addRebanho($cod, $dsc)
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

	public function deleteRebanho($id)
	{
		$this->delete('id = ' . intval($id));
	}

}