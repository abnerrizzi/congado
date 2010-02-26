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
class Model_Db_Alimento extends Model_Db
{

	protected $_name = 'alimento';
	protected $_select = false;

	public function getAlimentos($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getAlimento($id)
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

	public function updateAlimento($post)
	{
		$data = array(
//			'id'=> $post['id'],
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc'])
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function addAlimento($cod, $dsc)
	{

		if ($this->checkCodAlimento($cod)) {
			$data = array(
				'cod' => utf8_encode($cod),
				'dsc' => utf8_encode($dsc)
			);
			$result = $this->insert($data);
			return true;
		} else {
			return false;
		}

	}

	public function deleteAlimento($id)
	{
		$this->delete('id = ' . (int)$id);
	}

	private function checkCodAlimento($cod)
	{
		$query = $this->select()
			->from($this->_name)
			->where('cod = ?', utf8_encode($cod))
		;
		$result = $this->fetchAll($query);

		if ($result->count() > 0) {
			return false;
		} else {
			return true;
		}
		
	}

}