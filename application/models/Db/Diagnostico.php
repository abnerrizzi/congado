<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Db
 * @version $Id: Destino.php 522 2010-11-16 19:57:47Z bacteria_ $
 * 
 */
class Model_Db_Diagnostico extends Model_Db
{

	protected $_name = 'destino';
	protected $_select = false;

	public function getDiagnosticos($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getDiagnostico($id)
	{
		$id = (int)$id;
		$row = $this->fetchRow('id = ' . $id);
		if (!$row) {
			throw new Zend_Db_Table_Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function updateDestino($post)
	{
		$data = array(
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc'])
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function addDestino($cod, $dsc)
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

	public function deleteDestino($id)
	{
		$this->delete('id = ' . intval($id));
	}

}
