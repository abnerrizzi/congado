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
class Form_Alimento extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('regime_alimentar');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'cod', array(
			'label' => 'Código',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array('Alnum', new Zend_Validate_Db_NoRecordExists('alimento','cod')),
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
