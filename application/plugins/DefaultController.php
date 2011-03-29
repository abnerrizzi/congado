<?php
/**
 * @package Plugin
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Plugin
 * @version $Id: ModuleLayout.php 578 2010-12-20 12:20:31Z bacteria_ $
 * 
 */

class Plugin_DefaultController  extends Zend_Controller_Action
{

    public function init()
    {
        $auth = Zend_Auth::getInstance();
        $this->view->auth = $auth->hasIdentity();
        $this->view->fazenda_dsc = Zend_Auth::getInstance()->getIdentity()->fazenda_dsc;
    }

    public function postDispatch()
    {
    	if (!$this->view->title) {
    		throw new Zend_Controller_Exception('Titulo nao definido');
    	} elseif (!$this->view->baseUrl) {
    		throw new Zend_Controller_Exception('baseUrl nao definido');
    	}

    	$this->view->headScript()->prependScript("
            var _Module = \"".$this->getRequest()->getModuleName()."\";
            var _Controller = \"".$this->getRequest()->getControllerName()."\";
            var _Action = \"".$this->getRequest()->getActionName()."\";
        ");

    	if ($this->getRequest()->getActionName() == 'index') {
    		$this->renderScript('default/index.phtml');
    	} elseif ($this->getRequest()->getActionName() == 'edit' || $this->getRequest()->getActionName() == 'add') {
    		$this->renderScript('default/form.phtml');
        } elseif ($this->getRequest()->getActionName() == 'edit' || $this->getRequest()->getActionName() == 'add') {
        	$this->renderScript('default/delete.phtml');
    	}
    }

}
