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
class Form_Sanitario extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('causas_mortis');
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
			'label' => 'Animal',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 16,
			'class'	=> 'input',
		));
		$this->addElement('text', 'fichario', array(
			'class'	=> 'input',
			'size' => 30,
		));

		$this->addElement('text', 'data', array(
			'label' => 'Data',
			'required' => true,
			'filters' => array('StringTrim'),
			'validators' => array(
				new Zend_Validate_Date('dd/MM/YYYY'),
				new Plugin_Validate_Date_Between('01/01/1900', date('d/m/Y', time()), 'dd/mm/YYYY', true),
			),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'ocorrencia_id');
		$this->addElement('text', 'ocorrencia_cod', array(
			'label' => 'Ocorrência',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'ocorrencia', array(
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'sequencia_id');
		$this->addElement('text', 'sequencia_cod', array(
			'label' => 'Sequência',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'sequencia', array(
			'class'	=> 'input',
			'size' => 30,
		));

		$this->addElement('textarea', 'comentario', array(
			'label' => 'Comentário',
			'filters' => array('StringTrim', 'StringToUpper'),
			'rows' => 7,
			'cols' => 50,
			'class'	=> 'input',
		));

		$this->addElement('radio', 'tiposisbov', array(
			'label' => 'Tipo de Morte (SISBOV)',
			'required' => false,
			'separator' => "\n",
			'multiOptions' => array(
				'AB' => 'Abate',
				'NA' => 'Natural',
				'SA' => 'Sacrifício',
			),
		));

		$this->addElement('text', 'dataproximo', array(
			'label' => 'Data Proximo',
			'required' => true,
			'validators' => array(
				new Zend_Validate_Date('dd/MM/YYYY'),
			),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));


	}

}
