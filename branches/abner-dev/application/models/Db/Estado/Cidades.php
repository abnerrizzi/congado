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
class Model_Db_Estado_Cidades extends Model_Db_Estado
{

	protected $_name = 'aux_cidades';
	protected $_select = false;

	public function getCidades($id = false)
	{
		if ((int)$id) {
			$this->_select = $this->select()
				->from($this->_name, array('id', 'nome'), $this->_schema)
				->where('estado_id = ?', (int)$id)
				->order('nome asc')
			;
			return $this->fetchAll($this->_select)->toArray();
		} else {
			return false;
		}
	}

}