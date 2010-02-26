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
class Model_Db_Doenca extends Model_Db
{

	protected $_name = 'doenca';
	protected $_select = false;

	public function getDoencas($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getDoenca($id)
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

	public function updateDoenca($post)
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

	public function addDoenca($params)
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

	public function deleteDoenca($id)
	{
		$this->delete('id = ' . intval($id));
	}

}