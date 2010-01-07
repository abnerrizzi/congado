<?php

class MotivoLactacaoController extends Zend_Controller_Action
{

    public function init()
    {
        $auth = Zend_Auth::getInstance();
        $this->view->auth = $auth->hasIdentity();
        $this->view->title = 'Motivos de Encerramento de Lactação';
        $this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {

        $gridModel = new Model_Grid($this->view->title);
        $motivolactacaoModel = new Model_Db_MotivoLactacao();

        $_page  = $this->_getParam('page', 1);
        $_by    = $this->_getParam('by', 'id');
        $_order = $this->_getParam('sort', 'asc');
        $result = $motivolactacaoModel->getMotivoLactacaos($_by, $_order);

        /*
         * Paginator
         */
        $paginator = Zend_Paginator::factory($result);
        $paginator->setItemCountPerPage(Zend_Registry::get('configuration')->pagination->itemCoutPerPage);
        $paginator->setCurrentPageNumber($_page);

        /*
         * Fields
         */
        $fields[] = new Model_Grid_Fields('cod', 'MotivoLactacao', 35);
        $fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

        /*
         * Grid Model
         */
        $gridModel->setBaseUrl($this->view->baseUrl);
        $gridModel->setSorting(true);
        $gridModel->setPaginator($paginator);
        $gridModel->setFields($fields);
        $gridModel->setEdit(array(
        	'module'	=> 'motivolactacao',
            'action'	=> 'edit',
        ));
        $gridModel->setDelete(array(
        	'module'	=> 'motivolactacao',
            'action'	=> 'delete',
        ));
        $gridModel->setAdd(array(
        	'module'	=> 'motivolactacao',
            'action'	=> 'add',
        ));

        $this->view->sort = $this->_getParam('sort', 'id');
        $this->view->grid = $gridModel;

    }

    public function addAction()
    {

        $motivolactacaoForm = new Form_MotivoLactacao();
        $motivolactacaoForm->setAction('/motivolactacao/add');
        $motivolactacaoForm->setMethod('post');
        $this->view->form = $motivolactacaoForm;
        $this->view->elements = array('cod', 'dsc');

        if ($this->getRequest()->isPost()) {
            $formData = $this->getRequest()->getPost();
            if ($motivolactacaoForm->isValid($formData)) {
                $cod = $motivolactacaoForm->getValue('cod');
                $dsc = $motivolactacaoForm->getValue('dsc');
                $motivolactacaoModel = new Model_Db_MotivoLactacao();
                if ($motivolactacaoModel->addMotivoLactacao($cod, $dsc)) {
                    $this->_redirect('/'. $this->getRequest()->getControllerName());
                }
            } else {
                $motivolactacaoForm->populate($formData);
            }
        }

    }

    public function editAction()
    {

        $request      = $this->getRequest();
        $motivolactacaoId   = (int)$request->getParam('id');
        $motivolactacaoForm = new Form_MotivoLactacao();
        
        $motivolactacaoForm->setAction('/motivolactacao/edit');
        $motivolactacaoForm->setMethod('post');
        $motivolactacaoModel = new Model_Db_MotivoLactacao();
        $motivolactacaoForm->getElement('cod')
            ->setAttrib('readonly', 'readonly')
            ->setAttrib('class', 'readonly')
            ->removeValidator('NoRecordExists')
            ;

        if ($request->isPost()) {

            if ($motivolactacaoForm->isValid($request->getPost())) {
                $motivolactacaoModel->updateMotivoLactacao($motivolactacaoForm->getValues());
                $this->_redirect('motivolactacao/index');
            }

        } else {

            if ($motivolactacaoId > 0) {
                $result = $motivolactacaoModel->getMotivoLactacao($motivolactacaoId);
                $motivolactacaoForm->populate($result);
            } else {
                throw new Exception("invalid record number");
            }
        }

        $this->view->elements = array('id' , 'cod' , 'dsc');
        $this->view->form = $motivolactacaoForm;

    }

    public function deleteAction()
    {

        $request = $this->getRequest();
        $motivolactacaoForm = new Form_MotivoLactacao();
        $motivolactacaoForm->setAction('motivolactacao/delete');
        $motivolactacaoForm->setMethod('post');
        $motivolactacaoModel = new Model_Db_MotivoLactacao();

        if ($request->isPost() && $request->getParam('param', false) == 'motivolactacao') {
            $motivolactacaoId    = (int)$request->getParam('id');
            $motivolactacaoModel->deleteMotivoLactacao($motivolactacaoId);
            $this->view->error = false;
            $this->view->msg = 'Registro apagado com sucesso.';
        } else {
            $motivolactacaoId    = (int)$request->getParam('id');
            $this->view->error = true;
            $this->view->msg = 'Erro tentando apagar registro('.$motivolactacaoId.')';
        }
        $this->view->url = 'motivolactacao/index';

    }


}
