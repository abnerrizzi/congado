<?php

/**
 * @package Form
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Form
 * @version $Id$
 * 
 */
class Form_ExameReprodutivo extends Form_Default
{

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
