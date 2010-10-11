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
class Form_Local extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('local');
		$this->addElement('hidden', 'id');

		$this->addElement('select', 'fazenda_id', array(
			'label' => 'Fazenda',
			'required' => true,
			'class'	=> 'input',
		));

		$this->addElement('text', 'local', array(
			'label' => 'Local',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array('Alnum'),
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

		$this->addElement('text', 'area', array(
			'label' => 'Área (Ha)',
			'filters' => array('StringTrim', 'Digits'),
			'maxlength' => 10,
			'size' => 10,
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
