<?php

class BackupController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }

    public function exportAction()
    {
        // action body
        print '<pre>';
        $bkp = new Model_Db_Backup();
        $bkp->export();
        die();
        // default db

        $link = mysql_connect('localhost', 'root', '') or die(mysql_error());
        $database = 'congado';

        $result = mysql_query("SHOW TABLES FROM $database");
        while ($row = mysql_fetch_array($result))
        {
        	$tables[] = $row[0];
        }

        for ($i = 0; $i < count($tables); $i++)
        {
        	$result = mysql_query('SHOW CREATE TABLE `' . $database . '`.`' . $tables[$i]) or die(mysql_error());
        	$__return .= 'DROP TABLE IF EXISTS `' . $database . '`.`' . $tables[$i] . '`;' . "\n";

        	while ($row = mysql_fetch_array($result))
        	{
        		$__return .= $row[1];
        	}
        	$__return .= ";" . str_repeat("\n", 2);

        	$result = mysql_query('SELECT * FROM ' . $database . '.' . $tables[$i]);
        	while ($row = mysql_fetch_assoc($result))
        	{
        		$__return .= 'INSERT INTO `' . $database . '`.`' . $tables[$i] .'` (';
        		$data = array();
				while (list($key, $value) = @each($row))
				{
					$data['keys'][] = $key;
					$data['values'][] = addslashes(utf8_decode($value));
				}

				$__return .= join($data['keys'], ', ') . ')' . ' VALUES (\'' . join($data['values'], '\', \'') . '\');' . "\n";
        	}
        	
        }
        $__return = str_replace('CREATE TABLE `', 'CREATE TABLE `congado`.`', $__return);
        print $__return;

        die();
    }

    public function importAction()
    {
        // action body
    }

}
