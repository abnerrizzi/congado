<?php

class SystemController extends Zend_Controller_Action
{

    public function init()
    {
        $auth = Zend_Auth::getInstance();
		$this->view->auth = $auth->hasIdentity();
		$this->view->title = 'Configurações do Sistema';
		$this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {
        // action body
    }

    public function wallpaperAction()
    {
    	$auth = Zend_Auth::getInstance()->getStorage()->read();

        if (!$auth->admin) {
        	$this->view->msg = 'Somente administradores do sistema pode trocar o papel de parede.';
        	$this->render('warning');
        }

        $systemForm = new Form_System();
        $systemForm->setAction('/system/wallpaper');
		$systemForm->setMethod('post');
		$request = $this->getRequest();

    	if ($request->isPost()) {

			if ($systemForm->isValid($request->getPost())) {

				$adapter = new Zend_File_Transfer_Adapter_Http();
				$files = $adapter->getFileInfo();
				$backgroundFile = $files['background']['tmp_name'];
				$backgroundType = $files['background']['type'];
				if ($files['background']['size'] > 1024*1024*1) {
					die('arquivo maior que 1GB');
				}
				$handle = fopen($backgroundFile, 'r');
				$backgroundData = fread($handle, filesize($backgroundFile));

				$systemModel = new Model_Db_System();
				$systemModel->setBackupground($backgroundData, $backgroundType);

			}
		}

        $this->view->elements = array('background');
        $this->view->form = $systemForm;
    }

    public function backgroundAction()
    {
    	$systemModel = new Model_Db_System();
    	if ($systemModel->cacheBackground()) {
			$this->view->mime = $systemModel->getBackupgroundMimeType();
			$this->view->file = $systemModel::$filePath;
			$this->view->img = true;
    	} else {
    		die('else');
    	}
    	$this->_helper->layout()->disableLayout();
    }

}



