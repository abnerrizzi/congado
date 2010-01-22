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

	private $config;

	public function init()
	{
		$this->config = Zend_Registry::get('configuration')->resources->db;
		$backupDir = $this->config->backup->path;

		if (!is_dir($backupDir)) {
			if (!@mkdir($backupDir)) {
				$msg = "Erro criando/acessando diretório de backup\n";
				$msg .= $backupDir;
				throw new Zend_Exception($msg);
			}
		}

		$backupDir = realpath($backupDir);
		print '<pre>';
		if ($this->config->backup->enable == 1) {
			print_r($this->config->params);
			$backupFile = '"'.$backupDir . $this->config->params->dbname
						. date("-Ymd_His") . '.sql"';
			$backupCommand = "mysqldump"
				. " -h ".$this->config->params->host
				. " --user=".$this->config->params->username
				. " --password=".$this->config->params->password
				. " ".$this->config->params->dbname
				. " > ".$backupFile
			;

			// Execute backup command
			system($backupCommand);
			$backupFile = str_replace('\\', '/', $backupFile);
			print $backupFile;
			var_dump(is_file($backupFile));
			die();
		} else {
			die('nao vai fazer');
		}
		print $backupDir;
		die();
		
	}
	public function export()
	{

		$db = Zend_Registry::get('database');
		$db = $db->getConfig();
		$config = Zend_Registry::get('resources');
		print '<pre>';
		print_r($config);

		$__fileName  = dirname(dirname(__FILE__)); 
		$__fileName .= $db['dbname'] ."-". date('YmdHi') . ".sql";

		$__commandLine = "mysqldump " . $db['dbname'] . " --user=" . $db['username'] . " --password=" . $db['password'];
		$__commandLine .= " > " . $__fileName;
		print $__commandLine;
	}

}
