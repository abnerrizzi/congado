<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Estado.php 10 2010-01-08 13:06:35Z bacteria_ $
 * 
 */

class Model_Db_Estado extends Model_Db
{

	protected $_name = 'aux_estados';
	protected $_select = false;

	public function getEstados()
	{
		$result = $this->fetchAll();
		return $result->toArray();
	}

}