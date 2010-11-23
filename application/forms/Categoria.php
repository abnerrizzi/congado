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
class Form_Categoria extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('categoria');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'cod', array(
			'label' => 'Código',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array('Alnum', new Zend_Validate_Db_NoRecordExists('categoria','cod')),
			'maxlength' => 2,
			'size' => 1,
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

		$this->addElement('radio', 'sexo', array(
			'label' => 'Sexo',
			'filters' => array('StringTrim', 'StringToUpper'),
			'required' => true,
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
			'separator' => '&nbsp;'
		));
		$this->getElement('sexo')
			->addMultiOptions(array(
				'M' => 'Macho',
				'F' => 'Femea',
				'I' => 'Indiferente'
			))
		;
			
	}

}
