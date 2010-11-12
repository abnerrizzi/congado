<?php

/**
 * @package Form
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Form
 * @version $Id: Acompanhamento.php 490 2010-10-18 18:19:35Z bacteria_ $
 * 
 */
class Form_Transferencia extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('transferencia_de_embriao');
		$this->addElement('hidden', 'id');

		$this->addElement('select', 'fazenda_id', array(
			'label' => 'Fazenda',
			'required' => true,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'fichario_id', array(
			'required' => true
		));
		$this->addElement('text', 'fichario_cod', array(
			'label' => 'Vaca',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'fichario', array(
			'class'	=> 'input',
			'maxlength' => 21,
			'size' => 21,
		));

		$this->addElement('text', 'dt_transferencia', array(
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

		$this->addElement('hidden', 'tecnico_id', array(
			'required' => true
		));
		$this->addElement('text', 'tecnico_cod', array(
			'label' => 'Técnico',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'tecnico', array(
			'class'	=> 'input',
			'maxlength' => 21,
			'size' => 21,
		));

		$this->addElement('hidden', 'embriao_id', array(
			'required' => true
		));
		$this->addElement('text', 'embriao_cod', array(
			'label' => 'Embrião',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'embriao', array(
			'class'	=> 'input',
			'maxlength' => 21,
			'size' => 21,
		));

		$this->addElement('select', 'tipo', array(
			'label' => 'Tipo',
			'required' => true,
			'class'	=> 'input',
			'multiOptions' => array(
				'' => '---',
				'C' => 'Congelado',
				'F' => 'A Fresco',
			)
		));

		$this->addElement('select', 'tecnica', array(
			'label' => 'Técnica',
			'required' => true,
			'class'	=> 'input',
			'multiOptions' => array(
				'' => '---',
				'C' => 'Cirúrgica',
				'N' => 'Não Cirúrgica',
			)
		
		));
	}

}
