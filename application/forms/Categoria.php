<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Form_Categoria extends Zend_Form
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
        $this->setName('categoria');
        $this->addElement('hidden', 'id');

        $this->addElement('text', 'cod', array(
        	'label' => 'Código',
            'required' => true,
            'filters' => array('StringTrim', 'StringToUpper'),
            'validators' => array('Alnum', new Zend_Validate_Db_NoRecordExists('categoria','cod')),
            'maxlength' => 2,
            'size' => 1,
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

        $this->addElement('text', 'unidade', array(
            'label' => 'Unidade Animal',
        	'filters' => array('StringTrim', 'StringToUpper'),
        	'validators' => array('Float'),
            'maxlength' => 32,
            'size' => 32,
            'class'	=> 'input',
        ));

        $this->addElement('image', 'cancel', array(
        	'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/cancel.gif',
        ));
        $this->getElement('cancel')
            ->removeDecorator('Label')
            ->removeDecorator('Tag')
        ;

        $this->addElement('image', 'submit', array(
        	'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/save.gif',
        ));
        $this->getElement('submit')
            ->removeDecorator('Label')
            ->removeDecorator('Tag')
        ;
            
    }

}