<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Tecnico.php 9 2010-01-08 12:59:43Z bacteria_ $
 * 
 */

class Form_User extends Zend_Dojo_Form
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
		$this->setName('configuracoes_de_usuario');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'login', array(
			'label' => 'Login',
			'required' => true,
			'filters' => array('StringTrim'),
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'name', array(
			'label' => 'Nome de usu�rio',
			'required' => true,
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('password', 'newpass', array(
			'label' => 'Nova Senha',
			'value' => false,
			'required' => false,
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('password', 'oldpass', array(
			'label' => 'Senha Atual',
			'value' => false,
			'required' => false,
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('password', 'confirmpass', array(
			'label' => 'Confirma��o da Senha',
			'value' => false,
			'required' => false,
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('text', 'perpage', array(
			'label' => 'Registros por p�gina',
			'required' => false,
			'filters' => array('Int'),
			'maxlength' => 3,
			'size' => 4,
			'class' => 'input'
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