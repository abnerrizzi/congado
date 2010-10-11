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
class Form_Movimentacao extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('criador');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'date', array(
			'label' => 'Movimentação',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array('Alnum', new Zend_Validate_Db_NoRecordExists('parto','cod')),
			'maxlength' => 2,
			'size' => 2,
			'class'	=> 'input',
		));

		// new
		$this->addElement('hidden', 'new_id', array(
			'required' => true
		));
		$this->addElement('text', 'new_cod', array(
			'label' => 'Raça',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'new', array(
			'class'	=> 'input',
//			'readonly' => 'readonly',
//			'disable' => true,
		));

		$this->addElement('hidden', 'old_id', array(
			'required' => true
		));
		$this->addElement('text', 'old_cod', array(
			'label' => 'Raça',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'old', array(
			'class'	=> 'input',
//			'readonly' => 'readonly',
//			'disable' => true,
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
