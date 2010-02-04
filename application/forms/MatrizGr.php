<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Form_Matrizgr extends Form_Default
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
		$this->setName('matriz_de_graus_de_sangue');
		$this->addElement('hidden', 'id');

		$this->addElement('hidden', 'raca_id');
		$this->addElement('text', 'raca_cod', array(
			'label' => 'Raça',
			'required' => true,
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 2,
			'class'	=> 'input',
		));
		$this->addElement('select', 'raca', array(
			'required' => true,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'pai_id');
		$this->addElement('text', 'pai_cod', array(
			'label' => 'Gr. Sangue Pai',
			'required' => true,
			'filters' => array('StringTrim', 'Alnum'),
			'validators' => array(new Zend_Validate_Db_RecordExists('grausangue','cod')),
			'maxlength' => 3,
			'size' => 2,
			'class'	=> 'input',
		));
		$this->addElement('select', 'pai', array(
			'required' => true,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'mae_id');
		$this->addElement('text', 'mae_cod', array(
			'label' => 'Gr. Sangue Mãe',
			'required' => true,
			'filters' => array('StringTrim', 'Alnum'),
			'validators' => array(new Zend_Validate_Db_RecordExists('grausangue','cod')),
			'maxlength' => 3,
			'size' => 2,
			'class'	=> 'input',
		));
		$this->addElement('select', 'mae', array(
			'required' => true,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'cria_id');
		$this->addElement('text', 'cria_cod', array(
			'label' => 'Gr. Sangue Cria',
			'required' => true,
			'filters' => array('StringTrim', 'Alnum'),
			'validators' => array(new Zend_Validate_Db_RecordExists('grausangue','cod')),
			'maxlength' => 3,
			'size' => 2,
			'class'	=> 'input',
		));
		$this->addElement('select', 'cria', array(
			'required' => true,
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