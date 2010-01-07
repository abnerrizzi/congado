<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Form_Local extends Zend_Dojo_Form
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
        $this->setName('fazenda');
        $this->addElement('hidden', 'id');

        $this->addElement('select', 'fazenda_id', array(
            'label' => 'Fazenda',
            'required' => true,
            'class'	=> 'input',
        ));

        $this->addElement('text', 'local', array(
            'label' => 'Local',
            'required' => true,
        	'filters' => array('StringTrim', 'StringToUpper'),
        	'validators' => array('Alnum'),
            'maxlength' => 4,
            'size' => 4,
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

        $this->addElement('text', 'area', array(
            'label' => 'Área (Ha)',
        	'filters' => array('StringTrim', 'Digits'),
            'maxlength' => 10,
            'size' => 10,
            'class'	=> 'input_num',
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