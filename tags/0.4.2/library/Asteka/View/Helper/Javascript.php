<?php
/**
 * @package Helper
 */

/**
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Helper
 */
class Asteka_View_Helper_Javascript extends Zend_View_Helper_Abstract
{

	public $view;
	private $javaScriptPath = '/../public';


	public function setView(Zend_View_Interface $view)
	{
		$this->view = $view;
		return $this;
	}

	function javascript()
	{

		$request = Zend_Controller_Front::getInstance()->getRequest();
		if ($request->getModuleName() == 'default') {
			$moduleName = '';
		} else {
			$moduleName = $request->getModuleName().'/';
		}

		$file_uri = '/scripts/library/'.$moduleName.$request->getControllerName().'.js';
		if (file_exists(APPLICATION_PATH . $this->javaScriptPath . $file_uri))
		{
			$this->view->headScript()->appendFile($this->view->baseUrl().$file_uri);
		}
	}

}
