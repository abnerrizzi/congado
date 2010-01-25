<?php

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

	}

	public function downloadOLDAction()
	{
		$file = base64_decode($this->getRequest()->getParam('file'));
		print $file;
		die();
	}









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
		
		$file_extension = strtolower($path_info['extension']);
		var_dump($path_info);
	
		//This will set the Content-Type to the appropriate setting for the file
		switch($file_extension)
		{
			case 'exe': $ctype='application/octet-stream'; break;
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
		}
		else
		{
			$range = '';
		}
	
		//figure out download piece from range (if set)
		list($seek_start, $seek_end) = explode('-', $range, 2);
	
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
		header('Content-Disposition: attachment; filename="' . $filename . '"');
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
