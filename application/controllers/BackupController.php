<?php

/**
 * @package Controller
 */

/**
 * BackupController
 * 
 * Controla requisições de manipulação relacionada ao sistema de backup.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id$
 */
class BackupController extends Zend_Controller_Action
{

	public function init()
	{
		/* Initialize action controller here */
		$this->downloadKey = md5('chave de criptografia de download');
	}

	public function indexAction()
	{
		// action body
	}

	public function exportAction()
	{

		$bkp = new Model_Db_Backup();
		$this->view->file = $bkp->export();

	}

	public function importAction()
	{

		$backupForm = new Form_Backup();
		$backupForm->setMethod('post');
		$backupForm->setAction('/backup/import');
		$backupModel = new Model_Db_Backup();
		$this->view->form = $backupForm;
		$this->view->elements = array('backupfile');
		$adapter = new Zend_File_Transfer_Adapter_Http();

		if ($this->getRequest()->isPost()) {
			// Returns all known internal file information
			$files = $adapter->getFileInfo();
	
			foreach ($files as $file => $info) {
				// file uploaded ?
				if (!$adapter->isUploaded($file)) {
					print "Why havn't you uploaded the file ?";
					continue;
				}
	
				// validators are ok ?
				if (!$adapter->isValid($file)) {
					print "Sorry but $file is not what we wanted";
					continue;
				}

				$adapter->receive();

				$backupModel->importDump($adapter);

				$this->view->msg = "Importação realizada com sucesso.";
			}

		}
 
	}

	/**
	 * Funcao de intervencao de download retirada da internet
	 * 
	 * ! funcao suporta resume
	 */
	public function downloadAction()
	{
		$file = base64_decode($this->getRequest()->getParam('file'));
		$is_resume = true;

		//First, see if the file exists
		if (!is_file($file))
		{
			die("<b>404 File not found!</b>");
		}

		//Gather relevent info about file
		$size = filesize($file);
		$fileinfo = pathinfo($file);

		//workaround for IE filename bug with multiple periods / multiple dots in filename
		//that adds square brackets to filename - eg. setup.abc.exe becomes setup[1].abc.exe
		$filename = (strstr($_SERVER['HTTP_USER_AGENT'], 'MSIE')) ?
					  preg_replace('/\./', '%2e', $fileinfo['basename'], substr_count($fileinfo['basename'], '.') - 1) :
					  $fileinfo['basename'];

		$file_extension =".sql.gz";

		// decode file name
		$x = explode('/', $file);
		$x[3] = substr($x[3], 0, -(strlen($file_extension)));
		$filedownload = base64_decode($x[3]) . $file_extension;

		//This will set the Content-Type to the appropriate setting for the file
		switch($file_extension)
		{
			case 'zip': $ctype='application/zip'; break;
			case 'mp3': $ctype='audio/mpeg'; break;
			case 'mpg': $ctype='video/mpeg'; break;
			case 'avi': $ctype='video/x-msvideo'; break;
			default:	$ctype='application/force-download';
		}

		//check if http_range is sent by browser (or download manager)
		if($is_resume && isset($_SERVER['HTTP_RANGE']))
		{
			list($size_unit, $range_orig) = explode('=', $_SERVER['HTTP_RANGE'], 2);
	
			if ($size_unit == 'bytes')
			{
				//multiple ranges could be specified at the same time, but for simplicity only serve the first range
				//http://tools.ietf.org/id/draft-ietf-http-range-retrieval-00.txt
				list($range, $extra_ranges) = explode(',', $range_orig, 2);
			}
			else
			{
				$range = '';
			}
		} else {
			$range = '';
		}

		//set start and end based on range (if set), else set defaults
		//also check for invalid ranges.
		$seek_end = (empty($seek_end)) ? ($size - 1) : min(abs(intval($seek_end)),($size - 1));
		$seek_start = (empty($seek_start) || $seek_end < abs(intval($seek_start))) ? 0 : max(abs(intval($seek_start)),0);

		//add headers if resumable
		if ($is_resume)
		{
			//Only send partial content header if downloading a piece of the file (IE workaround)
			if ($seek_start > 0 || $seek_end < ($size - 1))
			{
				header('HTTP/1.1 206 Partial Content');
			}

			header('Accept-Ranges: bytes');
			header('Content-Range: bytes '.$seek_start.'-'.$seek_end.'/'.$size);
		}

		//headers for IE Bugs (is this necessary?)
		//header("Cache-Control: cache, must-revalidate");   
		//header("Pragma: public");

		header('Content-Type: ' . $ctype);
		header('Content-Disposition: attachment; filename="' . $filedownload . '"');
		header('Content-Length: '.($seek_end - $seek_start + 1));

		//open the file
		$fp = fopen($file, 'rb');
		//seek to start of missing part
		fseek($fp, $seek_start);

		//start buffered download
		while(!feof($fp))
		{
			//reset time limit for big files
			set_time_limit(0);
			print(fread($fp, 1024*8));
			flush();
			ob_flush();
		}

		fclose($fp);
		exit;
	}

}
