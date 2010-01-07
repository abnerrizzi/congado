<?php

class Form_Rebanho extends Zend_Dojo_Form
{

    protected $_standardElementDecorator = array(
        'ViewHelper',
        'Errors',
        array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
        array('Label', array('tag' => 'td')),
        array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
    );

    protected $_buttonElementDecorator = array(
        'ViewHelper',
        array('decorator' => array('td' => 'HtmlTag'), 'options' => array('tag' => 'td', 'colspan'=>'2','align'=>'center')),
        'Label',
        array('decorator' => array('tr' => 'HtmlTag'), 'options' => array('tag' => 'tr')),
    );

    protected $_standardGroupDecorator = array(
        'FormElements',
        array('HtmlTag', array(
        	'tag' => 'table',
            'align' => 'center',
        	'class' => 'my_pre_defined_class',
        	'border' => 1
        )),
        array('Fieldset', array('style' => 'width: 580px;'))
    );

    public function init()
    {
        $this->_initTranslator();
    }

    public function _initTranslator()
    {

        $translate = Zend_Registry::get('Zend_Translate');
        $this->setTranslator($translate);
    }

    public function __construct()
    {
        parent::__construct();
        $this->setName('rebanho');
        $this->addElement('hidden', 'id');

        $this->addElement('text', 'cod', array(
            'label' => 'Rebanho',
            'required' => true,
        	'filters' => array('StringTrim', 'StringToUpper'),
            'validators' => array(new Zend_Validate_Db_NoRecordExists('rebanho','cod')),
            'maxlength' => 2,
            'size' => 2,
            'class'	=> 'input',
        ));

        $this->addElement('text', 'dsc', array(
            'label' => 'Descrição',
            'required' => true,
        	'filters' => array('StringTrim', 'StringToUpper'),
            'maxlength' => 32,
            'size' => 32,
            'class'	=> 'input',
        ));

        $this->addElement('image', 'submit', array(
        	'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/save.gif',
        ));
        $this->getElement('submit')
            ->removeDecorator('Label')
            ->removeDecorator('Tag')
        ;

        $this->addElement('image', 'cancel', array(
        	'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/cancel.gif',
        ));
        $this->getElement('cancel')
            ->removeDecorator('Label')
            ->removeDecorator('Tag')
        ;

    }

}