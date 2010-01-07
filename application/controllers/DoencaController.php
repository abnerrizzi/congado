<?php

class DoencaController extends Zend_Controller_Action
{

    public function init()
    {
        $auth = Zend_Auth::getInstance();
        $this->view->auth = $auth->hasIdentity();
        $this->view->title = 'Tipos de Controle Sanitário';
        $this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {

        $gridModel = new Model_Grid($this->view->title);
        $doencaModel = new Model_Db_Doenca();

        $_page  = $this->_getParam('page', 1);
        $_by    = $this->_getParam('by', 'cod');
        $_order = $this->_getParam('sort', 'asc');
        $result = $doencaModel->getDoencas($_by, $_order);

        /*
         * Paginator
         */
        $paginator = Zend_Paginator::factory($result);
        $paginator->setItemCountPerPage(Zend_Registry::get('configuration')->pagination->itemCoutPerPage);
        $paginator->setCurrentPageNumber($_page);

        /*
         * Fields
         */
        $fields[] = new Model_Grid_Fields('cod', 'Controle', 35);
        $fields[] = new Model_Grid_Fields('dsc', 'Descrição', 200);

        /*
         * Grid Model
         */
        $gridModel->setBaseUrl($this->view->baseUrl);
        $gridModel->setSorting(true);
        $gridModel->setPaginator($paginator);
        $gridModel->setFields($fields);
        $gridModel->setEdit(array(
        	'module'	=> 'doenca',
            'action'	=> 'edit',
        ));
        $gridModel->setDelete(array(
        	'module'	=> 'doenca',
            'action'	=> 'delete',
        ));
        $gridModel->setAdd(array(
        	'module'	=> 'doenca',
            'action'	=> 'add',
        ));

        $this->view->sort = $this->_getParam('sort', 'id');
        $this->view->grid = $gridModel;

    }

    public function addAction()
    {

        $doencaForm = new Form_Doenca();
        $doencaForm->setAction('/doenca/add');
        $doencaForm->setMethod('post');
        $this->view->form = $doencaForm;

        if ($this->getRequest()->isPost()) {
            $formData = $this->getRequest()->getPost();
            if ($doencaForm->isValid($formData)) {
                $cod = $doencaForm->getValue('cod');
                $dsc = $doencaForm->getValue('dsc');
                $doencaModel = new Model_Db_Doenca();
                $values = $doencaForm->getValues(true);
                unset($values['id'], $values['submit'], $values['cancel']);
                if ($doencaModel->addDoenca($values)) {
                    $this->_redirect('/'. $this->getRequest()->getControllerName());
                }
            } else {
                $doencaForm->populate($formData);
            }
        }

    }

    public function editAction()
    {

        $request      = $this->getRequest();
        $doencaId       = (int)$request->getParam('id');
        $doencaForm     = new Form_Doenca();
        
        $doencaForm->setAction('/doenca/edit');
        $doencaForm->setMethod('post');
        $doencaModel = new Model_Db_Doenca();
        $doencaForm->getElement('cod')
            ->setAttrib('readonly', 'readonly')
            ->setAttrib('class', 'readonly')
            ->removeValidator('NoRecordExists')
            ;

        if ($request->isPost()) {

            if ($doencaForm->isValid($request->getPost())) {
                $values = $doencaForm->getValues(true);
                unset($values['submit'], $values['cancel']);
                $doencaModel->updateDoenca($values);
                $this->_redirect('doenca/index');
            }

        } else {

            if ($doencaId > 0) {
                $result = $doencaModel->getDoenca($doencaId);
                $doencaForm->populate($result);
            } else {
                throw new Exception("invalid record number");
            }
        }

        $this->view->elements = array('id' , 'cod' , 'dsc');
        $this->view->form = $doencaForm;

    }

    public function deleteAction()
    {

        $request = $this->getRequest();
        $doencaForm = new Form_Doenca();
        $doencaForm->setAction('doenca/delete');
        $doencaForm->setMethod('post');
        $doencaModel = new Model_Db_Doenca();

        if ($request->isPost() && $request->getParam('param', false) == 'doenca') {
            $doencaId    = (int)$request->getParam('id');
            $doencaModel->deleteDoenca($doencaId);
            $this->view->error = false;
            $this->view->msg = 'Registro apagado com sucesso.';
        } else {
            $doencaId    = (int)$request->getParam('id');
            $this->view->error = true;
            $this->view->msg = 'Erro tentando apagar registro('.$doencaId.')';
        }
        $this->view->url = 'doenca/index';

    }


}







