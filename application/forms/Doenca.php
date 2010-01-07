<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Form_Doenca extends Zend_Dojo_Form
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
        $this->setName('tipos_de_controle_sanitario');
        $this->addElement('hidden', 'id');

        $this->addElement('text', 'cod', array(
            'label' => 'Controle',
            'required' => true,
        	'filters' => array('StringTrim', 'StringToUpper'),
            'validators' => array(new Zend_Validate_Db_NoRecordExists('doenca','cod')),
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


        $this->addElement('checkbox', 'jan', array(
        	'label' => 'Janeiro',
        ));
        $this->addElement('checkbox', 'fev', array(
        	'label' => 'Fevereiro',
        ));
        $this->addElement('checkbox', 'mar', array(
        	'label' => 'Março',
        ));
        $this->addElement('checkbox', 'abr', array(
        	'label' => 'Abril',
        ));
        $this->addElement('checkbox', 'mai', array(
        	'label' => 'Maio',
        ));
        $this->addElement('checkbox', 'jun', array(
        	'label' => 'Junho',
        ));
        $this->addElement('checkbox', 'jul', array(
        	'label' => 'Julho',
        ));
        $this->addElement('checkbox', 'ago', array(
        	'label' => 'Agosto',
        ));
        $this->addElement('checkbox', 'set', array(
        	'label' => 'Setembro',
        ));
        $this->addElement('checkbox', 'out', array(
        	'label' => 'Outubro',
        ));
        $this->addElement('checkbox', 'nov', array(
        	'label' => 'Novembro',
        ));
        $this->addElement('checkbox', 'dez', array(
        	'label' => 'Dezembro',
        ));

        $this->addElement('checkbox', 'macho', array(
        	'label' => 'Macho',
        ));
        $this->addElement('checkbox', 'femea', array(
        	'label' => 'Fêmea',
        ));

        $this->addElement('text', 'idadeInicio', array(
            'label' => 'Inicial',
        	'filters' => array('StringTrim', 'digits'),
            'maxlength' => 5,
            'size' => 5,
            'class'	=> 'input_num',
        ));

        $this->addElement('text', 'idadeFinal', array(
            'label' => 'Final',
        	'filters' => array('StringTrim', 'digits'),
            'maxlength' => 5,
            'size' => 5,
            'class'	=> 'input_num',
        ));

        $this->addElement('text', 'dia', array(
            'label' => 'Dia Agendamento Automático',
        	'filters' => array('StringTrim', 'digits'),
            'maxlength' => 5,
            'size' => 5,
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