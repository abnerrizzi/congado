<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Test_IndexController extends Zend_Controller_Action
{

	public function init()
	{
		$auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Area de testes';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
	}

	public function indexAction()
	{
	}

	public function tableAction()
	{
		
	}

	public function jsminAction()
	{
		require_once '../library/JSMin.php';
		
		echo JSMin::minify(file_get_contents('C:\Arquivos de programas\Zend\Apache2\htdocs\congado\public/scripts/functions.js'));
		die();
	}

	public function breakAction()
	{
		print '<pre>';
		$z = 10;
		for ($i=0; $i < $z; $i++)
		{
			print  $i . "\n";
			if ($i == 4)
				break;
		}
		die();
	}

	public function jsonAction()
	{
		$x = "{['000123', '00012345679']}";
		print Zend_Json::decode($x);
		die();
	}

	public function jspkAction()
	{
		$fp = APPLICATION_PATH . '/../public' . '/scripts/functions.js';
		print '<pre>';

		require_once '../library/JavaScriptPacker.php';
		$jsPacker = new JavaScriptPacker($fp);
		echo $jsPacker->pack();

		exit;
	}


}
