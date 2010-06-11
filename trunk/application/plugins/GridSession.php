<?php
/**
 * @package Plugin
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Plugin
 * @version $Id: Auth.php 188 2010-04-09 19:04:15Z bacteria_ $
 * 
 */

class Plugin_GridSession extends Zend_Controller_Plugin_Abstract
{

	public function preDispatch(Zend_Controller_Request_Abstract $request)
	{

		if (!Zend_Auth::getInstance()->hasIdentity()) {
			return;
		}
		$_gridSession = new Zend_Session_Namespace('gridSession');

		// talking value of sort using Front controller getRequest() method.
		$_sort = $request->getParam('sort', false);
		$_by = $request->getParam('by', false);
		$_page = $request->getParam('page', false);
		$_module = $request->getModuleName();
		$_controller = $request->getControllerName();
		$_action = $request->getActionName();

		if ($_action == 'index') {
			if ($_gridSession->_module == $_module && $_gridSession->_controller == $_controller) {
				if (!$_sort) {
					if (!$_gridSession->_sort) {
						$_gridSession->_sort = $_sort;
					} else {
						$request->setParam('sort', $_gridSession->_sort);
					}
				} else {
					$_gridSession->_sort = $_sort;
				}
	
				if (!$_by) {
					if (!$_gridSession->_by) {
						$_gridSession->_by = $_by;
					} else {
						$request->setParam('by', $_gridSession->_by);
					}
				} else {
					$_gridSession->_by = $_by;
				}
	
				if (!$_page) {
					if (!$_gridSession->_page) {
						$_gridSession->_page = $_page;
					} else {
						$request->setParam('page', $_gridSession->_page);
					}
				} else {
					$_gridSession->_page = $_page;
				}
	
			} else {
				$_gridSession->unsetAll();
				$_gridSession->_module = $_module;
				$_gridSession->_controller = $_controller;
	
				if (!$_sort) {
					$_sort = $_gridSession->_sort;
				} else {
					$_gridSession->_sort = $_sort;
				}
	
				if (!$_by) {
					$_by = $_gridSession->_by;
				} else {
					$_gridSession->_by = $_sort;
				}
	
				if (!$_page) {
					$_page = $_gridSession->_page;
				} else {
					$_gridSession->_page = $_page;
				}
	
			}
		}

	}

}
