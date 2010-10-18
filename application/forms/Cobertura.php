<?php

/**
 * @package Form
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Form
 * @version $Id: Acompanhamento.php 468 2010-10-11 19:13:06Z bacteria_ $
 * 
 */
class Form_Cobertura extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('cobertura');
		$this->addElement('hidden', 'id');

		$this->addElement('select', 'fazenda_id', array(
			'label' => 'Fazenda',
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'vaca_id', array(
			'required' => true
		));
		$this->addElement('text', 'vaca_cod', array(
			'label' => 'Vaca',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'vaca', array(
			'class'	=> 'input',
		));

		$this->addElement('text', 'dt_coleta', array(
			'label' => 'Coleta',
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

		$this->addElement('hidden', 'touro_id', array(
			'required' => true
		));
		$this->addElement('text', 'touro_cod', array(
			'label' => 'Touro',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 4,
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

		$this->addElement('text', 'doses');
		$this->addElement('text', 'partida');
		$this->addElement('text', 'doses');


	}

}
