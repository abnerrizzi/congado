<?php
/**
 * @package Plugin
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Plugin
 * @version $Id$
 * 
 */

class Plugin_ModuleLayout extends Zend_Controller_Plugin_Abstract
{

	public function preDispatch(Zend_Controller_Request_Abstract $request)
	{

		$module = strtolower($request->getParam('module'));
		$layout =  Zend_Layout::getMvcInstance();

		if ($layout->getMvcEnabled())
		{
			switch ($module) {
				case 'default':
					break;
				default:
					$layout->setLayoutPath(APPLICATION_PATH . '/modules/' . $module . '/layouts/scripts');
					break;
			}
		}
	}

}
