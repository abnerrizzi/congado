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
		$this->fileName = base64_encode($this->db .'-'. date('YmdHis')) . ".sql";
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

		$this->fileNameFullPath = '"'.$this->backupDir . '/' . $this->fileName .'"';

		$this->DumpFileCreate($this->backupDir .'/'. $this->fileName);

		return $this->DumpFileCompact($this->backupDir . '/' . $this->fileName);
		
	}

	private function DumpFileCompact($fileName = false)
	{

		if ($fileName) {
			$handle = @fopen($fileName, 'r');
			if (!$handle) {
				throw new Zend_Exception("Erro criando arquivo de backup: ($fileName)");
			} else {
				$zp = gzopen($fileName . ".gz", "w");
				if (!$zp) {
					throw new Zend_Exception("Erro compactado dados do backup: ($fileName)");
				} else {
					fclose($handle);
					if (gzwrite($zp, file_get_contents($fileName)) && gzclose($zp)) {
						unlink($fileName);
					}
				}
			}
			return base64_encode($fileName . ".gz");
		}
	}

	private function DumpFileCreate($fileName = false)
	{
		if ($fileName) {
			$handle = @fopen($fileName, 'w');
			if (!$handle) {
				throw new Zend_Exception("Erro criando arquivo para geracao do Backup: ($fileName)");
			} else {
				fclose($handle);
				unlink($fileName);
				$backupCommand = "mysqldump"
					. " -h ".$this->host
					. " --user=".$this->user
					. " --password=".$this->pass
					. " ".$this->db
					. " > ".$this->fileNameFullPath
				;

				// Execute backup command
				system($backupCommand);

			}
			return true;
		}
	}


}
