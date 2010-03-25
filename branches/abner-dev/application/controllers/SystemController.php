<?php
/**
 * @package Controller
 */

/**
 * SystemController
 * 
 * Controla requisições de manipulação de configurações do sistema.
 *
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Controller
 * @version $Id: FicharioController.php 97 2010-02-26 14:55:11Z bacteria_ $
 */

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

    /**
     * Controlador responsavel pela atualizacao do papel de parede no banco de dados.
     */
    public function wallpaperAction()
    {
    	$auth = Zend_Auth::getInstance()->getStorage()->read();

    	// se o usuario nao for administrador nao permite a troca do papel de parede
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

				// Caso o arquivo seja do tipo BMP, ira ser convertido para JPG
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

    /**
     * Busca os dados no banco de dados e faz um cache em arquivo do papel de parede
     */
    public function backgroundAction()
    {
    	$systemModel = new Model_Db_System();
    	if ($systemModel->cacheBackground()) {
			$this->view->mime = $systemModel->getBackupgroundMimeType();
			$this->view->file = $systemModel->getFilePath();
			$this->view->img = true;
    	} else {
    		throw new Zend_Controller_Exception('Erro inesperado gerando cache do papel de parede');
    	}
    	$this->_helper->layout()->disableLayout();
    }

}



