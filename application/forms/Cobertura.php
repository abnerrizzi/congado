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



	}

}
