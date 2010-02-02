<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: MatrizGrauSangue.php 33 2010-01-20 11:16:40Z bacteria_ $
 * 
 */

class Model_Db_MatrizGrauSangue extends Model_Db
{

	protected $_name = 'matrizgr';
	protected $_select = false;

	public function getPaginatorAdapter($orderby = null, $order = null, $cols = '*')
	{

		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('m' => $this->_name), array('id'), $this->_schema)
			->join(array('raca' => 'raca'), 'm.raca_id = raca.id', array('raca_dsc' => 'dsc'), $this->_schema)
			->join(array('pai' => 'grausangue'), 'm.pai_id = pai.id', array('pai_dsc' => 'dsc'), $this->_schema)
			->join(array('mae' => 'grausangue'), 'm.mae_id = mae.id', array('mae_dsc' => 'dsc'), $this->_schema)
			->join(array('cria' => 'grausangue'), 'm.cria_id = cria.id', array('cria_dsc' => 'dsc'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;

	}

	public function getMatrizGrauSangues($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('m' => $this->_name), array('id'), $this->_schema)
			->join(array('raca' => 'raca'), 'm.raca_id = raca.id', array('raca_dsc' => 'dsc', 'raca_cod' => 'cod'), $this->_schema)
			->join(array('pai' => 'grausangue'), 'm.pai_id = pai.id', array('pai_dsc' => 'dsc', 'pai_cod' => 'cod'), $this->_schema)
			->join(array('mae' => 'grausangue'), 'm.mae_id = mae.id', array('mae_dsc' => 'dsc', 'mae_cod' => 'cod'), $this->_schema)
			->join(array('cria' => 'grausangue'), 'm.cria_id = cria.id', array('cria_dsc' => 'dsc', 'cria_cod' => 'cod'), $this->_schema)
			->order($orderby .' '. $order)
			;

		$result = $this->fetchAll($this->_select);
		return $result->toArray();
	}

	public function getMatrizGrauSangue($id)
	{
		$id = (int)$id;
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('m' => $this->_name), array('id'), $this->_schema)
			->join(array('raca' => 'raca'), 'm.raca_id = raca.id', array('raca_id' => 'id', 'raca' => new Zend_Db_Expr("concat(`raca`.`id`,';',`raca`.`cod`)"), 'raca_cod' => 'cod'), $this->_schema)
			->join(array('pai' => 'grausangue'), 'm.pai_id = pai.id', array('pai_id' => 'id', 'pai' => new Zend_Db_Expr("concat(`pai`.`id`,';',`pai`.`cod`)"), 'pai_cod' => 'cod'), $this->_schema)
			->join(array('mae' => 'grausangue'), 'm.mae_id = mae.id', array('mae_id' => 'id', 'mae' => new Zend_Db_Expr("concat(`mae`.`id`,';',`mae`.`cod`)"), 'mae_cod' => 'cod'), $this->_schema)
			->join(array('cria' => 'grausangue'), 'm.cria_id = cria.id', array('cria_id' => 'id', 'cria' => new Zend_Db_Expr("concat(`cria`.`id`,';',`cria`.`cod`)"), 'cria_cod' => 'cod'), $this->_schema)
			->where('m.id = ?', $id)
		;

		$row = $this->fetchRow($this->_select);
		if (!$row) {
			throw new Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function updateMatrizGrauSangue($post)
	{
		$data = array(
			'cria_id'=> intval($post['cria_id']),
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
		return false;
	}

	public function addMatrizGrauSangue(array $post)
	{

		foreach ($post as $key => $val) {
			$data[$key] = (int)$val;
		}

		if ($this->insert($data)) {
			return true;
		} else {
			return false;
		}

	}

	public function deleteMatrizGrauSangue($id)
	{
		$this->delete('id = ' . intval($id));
	}

}