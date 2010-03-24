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
class Model_Db_Acompanhamento extends Model_Db
{

	protected $_name = 'acompanhamento';
	protected $_select = false;

	/**
	 * Retorna uma array com todos os resultados
	 * 
	 * @param string $orderby
	 * @param string $order
	 * @return array
	 */
	public function getAcompanhamentos($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	/**
	 * Retorna uma array com o resultado do id informado
	 * 
	 * @param int $id
	 * @return array
	 */
	public function getAcompanhamento($id)
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
	 * Atualiza o registro
	 * 
	 * @param array $post
	 */
	public function updateAcompanhamento(array $post)
	{
		$data = array(
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc'])
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	/**
	 * Adiciona um registro
	 * 
	 * @param string $cod
	 * @param string $dsc
	 */
	public function addAcompanhamento($cod, $dsc)
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

	/**
	 * Deleta o registro
	 * 
	 * @param integer $id
	 */
	public function deleteAcompanhamento($id)
	{
		$this->delete('id = ' . intval($id));
	}

}