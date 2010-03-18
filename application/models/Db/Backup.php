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
			if (!@mkdir($this->backupDir, 0777, true)) {
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

	/**
	 * @return string filename with path
	 */
	public function getDump()
	{
		$fileName = $this->backupDir . '/' . uniqid() .'.sql';
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
				. " > ".$fileName
			;

			// Execute backup command
			system($backupCommand);

		}
		return $fileName;
	}

	public function importDump(Zend_File_Transfer_Adapter_Http $file)
	{
		// Caso o arquivo esteja compactado, descompactar e salvar o arquivo antes de executa-lo
		$actualState = base64_decode($this->export());
		if ($file->getMimeType() == 'application/x-gzip'){
			$fileDir = dirname(realpath($file->getFileName()));
			$fileName = $fileDir .'/'. uniqid() .'.sql';
			$sqlFile = $this->uncompressDump($file, $fileName);
			$importCommand = "mysql"
				. " -h ".$this->host
				. " --user=".$this->user
				. " --password=".$this->pass
				. " ".$this->db
				. " < ".$sqlFile
			;
			exec($importCommand, $output, $importReturn);
			if ($importReturn > 0) {
				$importCommand = "mysql"
					. " -h ".$this->host
					. " --user=".$this->user
					. " --password=".$this->pass
					. " ".$this->db
					. " < ".$actualState
				;
				throw new Zend_Exception('Erro importando backup. Backup anterior foi restaurado');
			}
			unlink($actualState);
			unlink($file->getFileName());
			return true;
		// Caso o arquivo esteja em modo texto, rodar o script de importacao basico
		} elseif ($file->getMimeType() == 'text/x-c') {
			$importCommand = "mysql"
				. " -h ".$this->host
				. " --user=".$this->user
				. " --password=".$this->pass
				. " ".$this->db
				. " < ".$file->getFileName()
			;

			exec($importCommand, $output, $importReturn);
			if ($importReturn > 0) {
				$importCommand = "mysql"
					. " -h ".$this->host
					. " --user=".$this->user
					. " --password=".$this->pass
					. " ".$this->db
					. " < ".$actualState
				;
				throw new Zend_Exception('Erro importando backup. Backup anterior foi restaurado');
			}
			unlink($actualState);
			unlink($file->getFileName());
			return true;
		// formato/padrao de arquivo desconhecido.
		} else {
			$msg = 'Tipo de arquivo diferente do esperado: (';
			$msg .= $file->getMimeType() .')';
			unlink($actualState);
			unlink($file->getFileName());
			throw new Zend_File_Transfer_Exception($msg);
		}
	}

	private function uncompressDump(Zend_File_Transfer_Adapter_Http $file, $fileName)
	{
		$zp = gzopen($file->getFileName(),'r');
		$handle = @fopen($fileName, 'w');
		if (!$handle) {
			throw new Zend_Exception("Erro criando arquivo para geracao do Backup: ($fileName)");
		} else {
			while (!gzeof($zp))
			{
				$content = gzread($zp, 1024);
				fwrite($handle, $content);
			}
		}
		gzclose($zp);
		fclose($handle);
		return $fileName;
	}
}
