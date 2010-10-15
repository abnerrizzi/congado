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
class Model_Db_Cobertura extends Model_Db
{

	protected $_name = 'cobertura';
	protected $_select = false;

	public function getPaginatorAdapter($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'data' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
			), $this->_schema)
			->joinLeft(array('v' => 'fichario'), 'c.fichario_id = v.id', array('vaca' => 'cod'), $this->_schema)
			->joinLeft(array('t' => 'fichario'), 'c.touro_id = t.id', array('touro' => 'cod'), $this->_schema)
			->joinLeft(array('i' => 'inseminador'), 'c.inseminador_id = i.id', array('inseminador' => 'dsc'), $this->_schema)
			->joinLeft(array('l' => 'lote'), 'c.lote_id = l.id', array('lote_dsc' => 'dsc'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}

}
