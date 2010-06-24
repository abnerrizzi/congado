<?php

/**
 * @package Form
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Form
 * @version $Id: ExameReprodutivo.php 342 2010-06-09 20:13:22Z bacteria_ $
 * 
 */
class Form_ExameReprodutivo extends Form_Default
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
		$this->setName('exame_reprodutivo');
		$this->addElement('hidden', 'id');

		$this->addElement('hidden', 'fichario_id', array('required' => true));
		$this->addElement('text', 'fichario_cod', array(
			'label' => 'Animal',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'fichario', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('text', 'data', array(
			'label' => 'Data',
			'required' => true,
			'filters' => array('StringTrim'),
			'validators' => array(
				new Zend_Validate_Date('dd/MM/YYYY'),
				new Plugin_Validate_Date_Between('01/01/1900', date('d/m/Y'), 'dd/mm/YYYY', true)
//				new Zend_Validate_Between('01/01/1900', date('d/m/Y'), true)
			),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'acompanhamento_id', array('required' => true));
		$this->addElement('text', 'acompanhamento_cod', array(
			'label' => 'Acompanhamento',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'acompanhamento', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('textarea', 'obs', array(
			'label' => 'Avaliação',
			'filters' => array('StringTrim', 'StringToUpper'),
			'rows' => 7,
			'cols' => 50,
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