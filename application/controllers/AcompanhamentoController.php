<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class AcompanhamentoController extends Zend_Controller_Action
{

    public function init()
    {
        $auth = Zend_Auth::getInstance();
        $this->view->auth = $auth->hasIdentity();
        $this->view->title = 'Tipos de Acompanhamento de Reprodução';
        $this->view->baseUrl = $this->getRequest()->getBaseUrl();
    }

    public function indexAction()
    {

        $gridModel = new Model_Grid($this->view->title);
        $acompanhamentoModel = new Model_Db_Acompanhamento();

        $_page  = $this->_getParam('page', 1);
        $_by    = $this->_getParam('by', 'id');
        $_order = $this->_getParam('sort', 'asc');
        $result = $acompanhamentoModel->getAcompanhamentos($_by, $_order);

        /*
         * Paginator
         */
        $paginator = Zend_Paginator::factory($result);
        $paginator->setItemCountPerPage(Zend_Registry::get('configuration')->pagination->itemCoutPerPage);
        $paginator->setCurrentPageNumber($_page);

        /*
         * Fields
         */
        $fields[] = new Model_Grid_Fields('cod', 'Acompanhamento', 35);
        $fields[] = new Model_Grid_Fields('dsc','Descrição', 200);

        /*
         * Grid Model
         */
        $gridModel->setBaseUrl($this->view->baseUrl);
        $gridModel->setSorting(true);
        $gridModel->setPaginator($paginator);
        $gridModel->setFields($fields);
        $gridModel->setEdit(array(
        	'module'	=> 'acompanhamento',
            'action'	=> 'edit',
        ));
        $gridModel->setDelete(array(
        	'module'	=> 'acompanhamento',
            'action'	=> 'delete',
        ));
        $gridModel->setAdd(array(
        	'module'	=> 'acompanhamento',
            'action'	=> 'add',
        ));

        $this->view->sort = $this->_getParam('sort', 'id');
        $this->view->grid = $gridModel;

    }

    public function addAction()
    {

        $acompanhamentoForm = new Form_Acompanhamento();
        $acompanhamentoForm->setAction('/acompanhamento/add');
        $acompanhamentoForm->setMethod('post');
        $this->view->form = $acompanhamentoForm;
        $this->view->elements = array('cod', 'dsc');

        if ($this->getRequest()->isPost()) {
            $formData = $this->getRequest()->getPost();
            if ($acompanhamentoForm->isValid($formData)) {
                $cod = $acompanhamentoForm->getValue('cod');
                $dsc = $acompanhamentoForm->getValue('dsc');
                $acompanhamentoModel = new Model_Db_Acompanhamento();
                if ($acompanhamentoModel->addAcompanhamento($cod, $dsc)) {
                    $this->_redirect('/'. $this->getRequest()->getControllerName());
                }
            } else {
                $acompanhamentoForm->populate($formData);
            }
        }

    }

    public function editAction()
    {

        $request      = $this->getRequest();
        $acompanhamentoId   = (int)$request->getParam('id');
        $acompanhamentoForm = new Form_Acompanhamento();
        
        $acompanhamentoForm->setAction('/acompanhamento/edit');
        $acompanhamentoForm->setMethod('post');
        $acompanhamentoModel = new Model_Db_Acompanhamento();
        $acompanhamentoForm->getElement('cod')
            ->setAttrib('readonly', 'readonly')
            ->setAttrib('class', 'readonly')
            ->removeValidator('NoRecordExists')
            ;

        if ($request->isPost()) {

            if ($acompanhamentoForm->isValid($request->getPost())) {
                $acompanhamentoModel->updateAcompanhamento($acompanhamentoForm->getValues());
                $this->_redirect('acompanhamento/index');
            }

        } else {

            if ($acompanhamentoId > 0) {
                $result = $acompanhamentoModel->getAcompanhamento($acompanhamentoId);
                $acompanhamentoForm->populate($result);
            } else {
                throw new Exception("invalid record number");
            }
        }

        $this->view->elements = array('id' , 'cod' , 'dsc');
        $this->view->form = $acompanhamentoForm;

    }

    public function deleteAction()
    {

        $request = $this->getRequest();
        $acompanhamentoForm = new Form_Acompanhamento();
        $acompanhamentoForm->setAction('acompanhamento/delete');
        $acompanhamentoForm->setMethod('post');
        $acompanhamentoModel = new Model_Db_Acompanhamento();

        if ($request->isPost() && $request->getParam('param', false) == 'acompanhamento') {
            $acompanhamentoId    = (int)$request->getParam('id');
            $acompanhamentoModel->deleteAcompanhamento($acompanhamentoId);
            $this->view->error = false;
            $this->view->msg = 'Registro apagado com sucesso.';
        } else {
            $acompanhamentoId    = (int)$request->getParam('id');
            $this->view->error = true;
            $this->view->msg = 'Erro tentando apagar registro('.$acompanhamentoId.')';
        }
        $this->view->url = 'acompanhamento/index';

    }


}
