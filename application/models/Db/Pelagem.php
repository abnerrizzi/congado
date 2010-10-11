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
class Model_Db_Pelagem extends Model_Db implements Model_Db_Interface_Pelagem
{

	protected $_name = 'pelagem';
	protected $_select = false;

	public function getPelagens($orderby = null, $order = null)
	{
		die('getPelagens');
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getById($id)
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
	public function listPelagens($cols = '*')
	{

		die('listPelagens');
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

	public function update($post)
	{
		$data = array(
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc'])
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function add($cod, $dsc)
	{

		if ($this->checkCodPelagem($cod)) {
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

	public function delete($id)
	{
		$this->delete('id = ' . intval($id));
	}

	function checkCod($cod)
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
