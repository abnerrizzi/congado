<?php

/**
 * @package Form
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Form
 * @version $Id: Alimento.php 490 2010-10-18 18:19:35Z bacteria_ $
 * 
 */
class Form_Authfazenda extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('regime_alimentar');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'cod', array(
			'label' => 'Código',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array('Alnum', new Zend_Validate_Db_NoRecordExists('alimento','cod')),
			'maxlength' => 4,
			'size' => 4,
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

	}

}
