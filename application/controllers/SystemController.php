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

				$systemModel = new Model_Db_System();
				$adapter = new Zend_File_Transfer_Adapter_Http();
				$files = $adapter->getFileInfo();
				$backgroundFile = $files['background']['tmp_name'];
				$backgroundType = $files['background']['type'];
				if (strpos(strtolower($backgroundType), 'bmp')) {
					if ($systemModel->imageCreateFromBmp($files['background']['tmp_name'])) {
						$dir = realpath(APPLICATION_PATH . '/../scripts');
						$file = "wallpaper";
						$backgroundFile = $dir . '/' . $file;
						$handle = fopen($backgroundFile, 'r');

						// Buscando informacoes do mime type atravez do arquivo temporario
						$backgroundType = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $backgroundFile);
						$backgroundType = mime_content_type($backgroundFile);
					}
				} else {
					$handle = fopen($backgroundFile, 'r');
				}

				$backgroundData = fread($handle, filesize($backgroundFile));

				$systemModel->setBackupground($backgroundData, $backgroundType, $backgroundFile);

				$this->_redirect('/');
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
			$this->view->file = $systemModel->getFilePath();
			$this->view->img = true;
    	} else {
    		die('else');
    	}
    	$this->_helper->layout()->disableLayout();
    }

}



