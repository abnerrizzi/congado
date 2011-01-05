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
class Form_Cobertura extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('cobertura');
		$this->addElement('hidden', 'id');

		$this->addElement('hidden', 'fazenda_id');

		$this->addElement('hidden', 'vaca_id', array(
			'required' => true
		));
		$this->addElement('text', 'vaca_cod', array(
			'label' => 'Vaca',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'vaca', array(
			'class'	=> 'input',
			'maxlength' => 21,
			'size' => 21,
		));

		$this->addElement('text', 'dt_cobertura', array(
			'label' => 'Data Cobertura',
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

		$this->addElement('text', 'dataCio', array(
			'label' => '',
			'required' => true,
			'filters' => array('StringTrim'),
			'validators' => array(
				new Zend_Validate_Date('dd/MM/YYYY'),
			),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('radio', 'tipo', array(
			'label' => 'Tipo da Cobertura',
			'class'	=> 'input',
		));

		$this->addElement('text', 'numerocobertura', array(
			'label' => 'Cobertura N°',
			'class' => 'readonly_num',
			'size' => 6,
		));

		$this->addElement('text', 'ultima_cobertura', array(
			'label' => 'Última Cobertura',
			'class' => 'readonly_num',
			'size' => 10
		));

		$this->addElement('text', 'ultima_tipo', array(
			'label' => 'Última Cobertura Tipo',
			'class' => 'input',
		));



		$this->addElement('hidden', 'touro_id', array(
			'required' => true
		));
		$this->addElement('text', 'touro_cod', array(
			'label' => 'Touro',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'touro', array(
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'inseminador_id', array(
			'required' => true
		));
		$this->addElement('text', 'inseminador_cod', array(
			'label' => 'Inseminador',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'inseminador', array(
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'lote_id', array(
			'required' => true
		));
		$this->addElement('text', 'lote_cod', array(
			'label' => 'Lote',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'lote', array(
			'class'	=> 'input',
		));

		$this->addElement('text', 'doses', array(
			'class'	=> 'input',
		));
		$this->addElement('text', 'partida', array(
			'class'	=> 'input',
		));
		$this->addElement('text', 'doses', array(
			'class'	=> 'input',
		));


	}

}
