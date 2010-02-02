<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: EstacaoMonta.php 33 2010-01-20 11:16:40Z bacteria_ $
 * 
 */

class Model_Db_EstacaoMonta extends Model_Db
{

	protected $_name = 'estacaomonta';
	protected $_select = false;

	public function getPaginatorAdapter($orderby = null, $order = null, $cols = '*')
	{

		if (!is_array($cols)) {
			$cols = array($cols);
		}

		$this->_select = $this->select()
			->from($this->_name, array(
				'id',
				'cod',
				'dsc',
				'dt_inicio' => "date_format(dt_inicio, '%d/%m/%Y')",
				'dt_fim' => "date_format(dt_fim, '%d/%m/%Y')",
			));

		if ($orderby != null && $order != null) {
			$this->_select->order($orderby .' '. $order);
		}

		return $this->_select;

	}

	public function getEstacaoMontas($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->from($this->_name, array(
				'id',
				'cod',
				'dsc',
				'dt_inicio' => "date_format(dt_inicio, '%d/%m/%Y')",
				'dt_fim' => "date_format(dt_fim, '%d/%m/%Y')",
			))
			->order($orderby .' '. $order)
			;
		$result = $this->fetchAll($this->_select);
		return $result->toArray();
	}

	public function getEstacaoMonta($id)
	{
		$id = (int)$id;
		$this->_select = $this->select()
			->from($this->_name, array(
				'id',
				'cod',
				'dsc',
				'dt_inicio' => "date_format(dt_inicio, '%d/%m/%Y')",
				'dt_fim' => "date_format(dt_fim, '%d/%m/%Y')",
			))
			->where('id = ?', $id)
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

	public function updateEstacaoMonta($post)
	{
		$data = array(
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc']),
			'dt_inicio' => new Zend_Db_Expr("STR_TO_DATE('".$post['dt_inicio']."','%d/%m/%Y')"),
			'dt_fim' => new Zend_Db_Expr("STR_TO_DATE('".$post['dt_fim']."','%d/%m/%Y')"),
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function addEstacaoMonta($cod, $dsc, $dt_inicio, $dt_fim)
	{

		$data = array(
			'cod' => utf8_encode($cod),
			'dsc' => utf8_encode($dsc),
			'dt_inicio' => new Zend_Db_Expr("STR_TO_DATE('$dt_inicio','%d/%m/%Y')"),
			'dt_fim' => new Zend_Db_Expr("STR_TO_DATE('$dt_fim','%d/%m/%Y')"),
		);

		if ($this->insert($data)) {
			return true;
		} else {
			return false;
		}

	}

	public function deleteEstacaoMonta($id)
	{
		$this->delete('id = ' . intval($id));
	}

}