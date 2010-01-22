<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Db.php 10 2010-01-08 13:06:35Z bacteria_ $
 * 
 */

final class Model_Db_Backup extends Model_Db
{

	protected $config;
	protected $host;
	protected $user;
	protected $pass;
	protected $db;
	protected $path;
	protected $fileName;
	protected $backupDir;

	public function init()
	{

		$config = Zend_Registry::get('configuration')->resources->db;

		$this->host = $config->params->host;
		$this->user = $config->params->username;
		$this->pass = $config->params->password;
		$this->db = $config->params->dbname;
		$this->fileName = $this->db .'-'. date('YmdHis') . ".sql";
		$this->backupDir = '../scripts/backup';

	}

	public function export()
	{

		if (!is_dir($this->backupDir)) {
			if (!@mkdir($this->backupDir)) {
				$msg = "Erro criando/acessando diretório de backup: (".$this->backupDir.")";
				throw new Zend_Exception($msg);
			}
		}

		$this->backupDir = realpath($this->backupDir);

//		$this->fileName = $this->config->params->dbname
//					. date("-Ymd_His") . '.sql';

		$this->fileNameFullPath = '"'.$this->backupDir . '/' . $this->fileName .'"';

		$backupCommand = "mysqldump"
			. " -h ".$this->host
			. " --user=".$this->user
			. " --password=".$this->pass
			. " ".$this->db
			. " > ".$this->fileNameFullPath
		;

		// Execute backup command
		system($backupCommand);

		
		if (!@file_exists($this->backupDir . '/' . $this->fileName)) {
			throw new Zend_Exception('Erro criando arquivo de backup');
		} else {

			// Put backup content into string
			$handle = fopen($this->backupDir . '/' . $this->fileName, 'r');
			$backupContent = file_get_contents($this->backupDir .'/'. $this->fileName);
			fclose($handle);

			$zp = gzopen($this->backupDir .'/'. $this->fileName .'.gz', "w");
			gzwrite($zp, $backupContent);
			gzclose($zp);

		}
		
		return $this->backupDir .'/'. $this->fileName;
		
	}

}
