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
class Form_Diagnostico extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('diagnostico');
		$this->addElement('hidden', 'id');

		$this->addElement('hidden', 'fazenda_id');

		$this->addElement('hidden', 'fichario_id');
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

		$this->addElement('text', 'dt_diagnostico', array(
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

		$this->addElement('radio', 'prenha', array(
			'label' => 'Diagnóstico',
			'filters' => array('StringTrim', 'StringToUpper'),
			'required' => true,
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
			'separator' => '&nbsp;'
		));
		$this->getElement('prenha')
			->addMultiOptions(array(
				'1' => 'Prenha',
				'0' => 'Vazia',
			))
		;
			
	}

}
