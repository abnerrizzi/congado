<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Db.php 10 2010-01-08 13:06:35Z bacteria_ $
 * 
 */

class Model_Db_Backup extends Model_Db
{

	public function export()
	{

		$db = Zend_Registry::get('database');
		$db = $db->getConfig();

		$__fileName = $db['dbname'] ."-". date('YmdHi') . ".sql";

		$__commandLine = "mysqldump " . $db['dbname'] . " --user=" . $db['username'] . " --password=" . $db['password'];
		$__commandLine .= " > " . $__fileName;
		print $__commandLine;
	}

}
