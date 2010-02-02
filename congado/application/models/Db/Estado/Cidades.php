<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Cidades.php 10 2010-01-08 13:06:35Z bacteria_ $
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