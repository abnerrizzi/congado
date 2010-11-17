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
class Form_EstacaoMonta extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('estacoes_de_monta');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'cod', array(
			'label' => 'Estação Monta',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array(new Zend_Validate_Db_NoRecordExists('estacaomonta','cod')),
			'maxlength' => 2,
			'size' => 2,
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

		$this->addElement('text', 'dt_inicio', array(
			'label' => 'Data Início',
			'required' => true,
			'filters' => array('StringTrim'),
			'validators' => array(
				new Zend_Validate_Date('dd/MM/YYYY')
			),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('text', 'dt_fim', array(
			'label' => 'Data Fim',
			'required' => true,
			'filters' => array('StringTrim'),
			'validators' => array(
				new Zend_Validate_Date('dd/MM/YYYY')
			),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

	}

}
