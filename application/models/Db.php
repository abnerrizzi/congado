<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Model_Db extends Zend_Db_Table_Abstract
{

	public function init()
	{
		$db = Zend_Registry::get('database');
		$db = $db->getConfig();
		$this->_schema = $db['dbname'];
	}

	public function getPaginatorAdapter($orderby = null, $order = null, $cols = '*')
	{

		if (!is_array($cols)) {
			$cols = array($cols);
		}

		$select = $this->select()
			->from($this->_name, $cols, $this->_schema);

		if ($orderby != null && $order != null) {
			$select->order($orderby .' '. $order);
		}

		return $select;

	}

	/*
	public function getTotalRowCount()
	{

		$this->_select = $this->select()
			->from($this->_name, array(Zend_Paginator_Adapter_DbSelect::ROW_COUNT_COLUMN => 'id'));

		$result = ($this->fetchRow($this->_select)->toArray());

		return (int)$result[Zend_Paginator_Adapter_DbSelect::ROW_COUNT_COLUMN];

	}
	*/

}