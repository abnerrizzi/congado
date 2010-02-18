<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Tecnico.php 9 2010-01-08 12:59:43Z bacteria_ $
 * 
 */

class Form_System extends Form_Default
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
		$this->setName('configuracoes_do_sistema');
		$this->setAttrib('enctype', 'multipart/form-data');
		$this->addElement('hidden', 'id');

		$this->addElement('file', 'background', array(
			'label' => 'Papel de parede',
			'validators' => array('IsImage'),
			'validators' => array(array('Size', false, 4194304)) // maximo de 4 MB
		));

	}

}