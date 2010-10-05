<?php
/**
 * @package Helper
 */
/**
 * @package Helper
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @version $Id$
 */
class Zend_View_Helper_CssHelper extends Zend_View_Helper_Abstract
{

	public $view;
	private $cssPath = '/../public';


	public function setView(Zend_View_Interface $view)
	{
		$this->view = $view;
		return $this;
	}

	function cssHelper()
	{

		throw new Zend_View_Exception('Modulo desabilitado por nao ter utilidade');
		$request = Zend_Controller_Front::getInstance()->getRequest();
		$file_uri = '/styles/'.$request->getControllerName().'.css';
		if (file_exists(APPLICATION_PATH . $this->cssPath . $file_uri))
		{
			$this->view->headScript()->appendFile($this->view->baseUrl().$file_uri);
		}
	}
}