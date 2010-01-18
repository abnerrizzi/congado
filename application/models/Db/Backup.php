<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Db.php 10 2010-01-08 13:06:35Z bacteria_ $
 * 
 */

class Model_Db_Backup extends Zend_Db_Table_Abstract
{

	public function init()
	{
		$db = Zend_Registry::get('database');
		$db = $db->getConfig();
		$this->_schema = $db['dbname'];
	}

	public function export()
	{

		$__return = '';

		$query = $this->select()
			->set
		;
		print $query;
		
	}

}
