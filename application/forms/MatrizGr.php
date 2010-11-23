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
		$this->addElement('text', 'raca', array(
			'required' => true,
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
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
		$this->addElement('text', 'pai', array(
			'required' => true,
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
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
		$this->addElement('text', 'mae', array(
			'required' => true,
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
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
		$this->addElement('text', 'cria', array(
			'required' => true,
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));


	}

}
