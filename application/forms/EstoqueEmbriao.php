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
class Form_EstoqueEmbriao extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('estoque_de_embrioes');
		$this->addElement('hidden', 'id');

		$this->addElement('select', 'fazenda_id', array(
			'label' => 'Fazenda',
//			'required' => true,
			'class'	=> 'input',
		));

		$this->addElement('text', 'embriao', array(
			'label' => 'Embrião',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('text', 'dt_coleta', array(
			'label' => 'Data',
			'required' => true,
			'filters' => array('StringTrim'),
			'validators' => array(
				new Zend_Validate_Date('dd/MM/YYYY'),
				new Plugin_Validate_Date_Between('01/01/1900', date('d/m/Y'), 'dd/mm/YYYY', true)
			),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'doadora_id', array(
			'required' => true
		));
		$this->addElement('text', 'doadora_cod', array(
			'label' => 'Doadora',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'doadora', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('hidden', 'touro_id');
		$this->addElement('text', 'touro_cod', array(
			'label' => 'Touro',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'touro', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('radio', 'sexo', array(
			'label' => 'Sexo',
			'separator' => "\n",
			'multiOptions' => array(
				'M' => 'Macho',
				'F' => 'Fêmea',
			),
		));

		$this->addElement('hidden', 'criador_id');
		$this->addElement('text', 'criador_cod', array(
			'label' => 'Criador',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'criador', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('hidden', 'obs', array(
			'label' => 'Observação',
			'filters' => array('StringTrim', 'StringToUpper'),
			'class'	=> 'input',
		));

	}

}
