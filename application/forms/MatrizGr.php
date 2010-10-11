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
class Form_MatrizGr extends Form_Default
{

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
