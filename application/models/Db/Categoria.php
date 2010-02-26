<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Model_Db_Categoria extends Model_Db
{

	protected $_name = 'categoria';
	protected $_select = false;

	public function getCategorias($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getCategoria($id)
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
	public function listCategorias($cols = '*')
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

	public function updateCategoria($post)
	{

		if ($post['unidade'] == '') {
			$post['unidade'] = null;
		} else {
			$post['unidade'] = floatval($post['unidade']);
		}

		$data = array(
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc']),
			'unidade' => $post['unidade'],
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function addCategoria($cod, $dsc, $unidade)
	{

		if ($unidade == '') {
			$unidade = null;
		} else {
			$unidade = floatval($unidade);
		}

		if ($this->checkCodPelagem($cod)) {
			$data = array(
				'cod' => utf8_encode($cod),
				'dsc' => utf8_encode($dsc),
				'unidade' => $unidade,
			);
			$result = $this->insert($data);
			return true;
		} else {
			return false;
		}

	}

	public function deleteCategoria($id)
	{
		$this->delete('id = ' . intval($id));
	}

	private function checkCodPelagem($cod)
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