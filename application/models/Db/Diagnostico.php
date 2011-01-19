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
class Model_Db_Diagnostico extends Model_Db
{

	protected $_name = 'diagnostico';

	public function getPaginatorAdapter($orderby = null, $order = null, $cols = '*')
	{

		if ($orderby == 'data') {
			$orderby = 'dt_diagnostico';
		} elseif ($orderby == 'diag') {
			$orderby = 'prenha';
		}

		if (!is_array($cols)) {
			$cols = array($cols);
		}

		$this->_select
			->from($this->_name, array(
				'id',
				'data' => new Zend_Db_Expr("DATE_FORMAT (dt_diagnostico, '%d/%m/%Y')"),
				'diag' => new Zend_Db_Expr("IF (prenha = 1, 'Prenha', 'Vazia')"),
			), $this->_schema)
			->joinLeft('fichario', $this->_name.'.fichario_id = fichario.id', array('vaca_cod' => 'cod', 'vaca' => 'nome'),$this->_schema)
		;

		if ($orderby != null && $order != null) {
			$this->_select->order($orderby .' '. $order);
		}

		return $this->_select;

	}

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

}
