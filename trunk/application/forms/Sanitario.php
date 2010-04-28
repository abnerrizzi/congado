<?php

/**
 * @package Form
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Form
 * @version $Id: Morte.php 100 2010-02-26 19:12:18Z bacteria_ $
 * 
 */
class Form_Sanitario extends Form_Default
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
		$this->setName('causas_mortis');
		$this->addElement('hidden', 'id');

		$this->addElement('hidden', 'fichario_id', array(
			'required' => true
		));
		$this->addElement('text', 'fichario_cod', array(
			'label' => 'Animal',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'fichario', array(
			'class'	=> 'input',
			'size' => 30,
		));

		$this->addElement('text', 'data', array(
			'label' => 'Data Data',
			'required' => true,
			'filters' => array('StringTrim'),
			'validators' => array(
				new Zend_Validate_Date('dd/mm/YYYY'),
			),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'ocorrencia_id');
		$this->addElement('text', 'ocorrencia_cod', array(
			'label' => 'Ocorrência',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'ocorrencia', array(
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'sequencia_id');
		$this->addElement('text', 'sequencia_cod', array(
			'label' => 'Sequência',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'sequencia', array(
			'class'	=> 'input',
			'size' => 30,
		));

		$this->addElement('textarea', 'comentario', array(
			'label' => 'Comentário',
			'filters' => array('StringTrim', 'StringToUpper'),
			'rows' => 7,
			'cols' => 50,
			'class'	=> 'input',
		));

		$this->addElement('radio', 'tiposisbov', array(
			'label' => 'Tipo de Morte (SISBOV)',
			'required' => false,
			'separator' => "\n",
			'multiOptions' => array(
				'AB' => 'Abate',
				'NA' => 'Natural',
				'SA' => 'Sacrifício',
			),
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