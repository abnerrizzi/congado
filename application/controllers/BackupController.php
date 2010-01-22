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

		$bkp = new Model_Db_Backup();
		$bkp->export();

	}

	public function importAction()
	{

	}

}
