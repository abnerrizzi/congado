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
class Form_Fichario extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('fichario');
		$this->addElement('hidden', 'id');

		$this->addElement('hidden', 'fazenda_id');

		$this->addElement('text', 'cod', array(
			'label' => 'Animal',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 16,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'nome', array(
			'label' => 'Nome',
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 21,
			'size' => 21,
			'class'	=> 'input',
		));

		$this->addElement('text', 'rgn', array(
			'label' => 'RGN',
			'filters' => array('StringTrim', 'Alnum', 'StringToUpper'),
			'maxlength' => 16,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'sisbov', array(
			'label' => 'SISBOV',
			'filters' => array('StringTrim', 'Alnum', 'StringToUpper'),
			'maxlength' => 16,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'dt_nascimento', array(
			'label' => 'Data Nascimento',
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

		$this->addElement('hidden', 'criador_id');
		$this->addElement('text', 'criador_cod', array(
			'label' => 'Criador',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'criador', array(
			'class'	=> 'input',
//			'readonly' => 'readonly',
//			'disable' => true,
		));

		$this->addElement('hidden', 'pelagem_id');
		$this->addElement('text', 'pelagem_cod', array(
			'label' => 'Pelagem',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 2,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'pelagem', array(
			'class'	=> 'input',
//			'readonly' => 'readonly',
//			'disable' => true,
		));

		$this->addElement('hidden', 'raca_id', array(
			'required' => true
		));
		$this->addElement('text', 'raca_cod', array(
			'label' => 'Raça',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 3,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'raca', array(
			'class'	=> 'input',
//			'readonly' => 'readonly',
//			'disable' => true,
		));

		$this->addElement('hidden', 'rebanho_id', array(
			'required' => true
		));
		$this->addElement('text', 'rebanho_cod', array(
			'label' => 'Rebanho',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 2,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'rebanho', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('hidden', 'categoria_id', array(
			'required' => true,
		));
		$this->addElement('text', 'categoria_cod', array(
			'label' => 'Categoria',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 2,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'categoria', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('hidden', 'local_id');
		$this->addElement('text', 'local_cod', array(
			'label' => 'Local',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'local', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('hidden', 'grausangue_id');
		$this->addElement('checkbox', 'grausangue_manual', array(
			'label' => 'Manual',
			'checkedValue' => 1,
			'uncheckedValue' => 0,
		));
		$this->addElement('text', 'grausangue_cod', array(
			'label' => 'Grau de Sangue',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input',
		));
		$this->addElement('text', 'grausangue', array(
			'class'	=> 'input',
		));


		$this->addElement('radio', 'sexo', array(
			'label' => 'Sexo',
			'required' => true,
			'separator' => "\n",
			'multiOptions' => array(
				'M' => 'Macho',
				'F' => 'Fêmea',
			),
		));

		$this->addElement('radio', 'origem', array(
			'label' => 'Origem',
			'required' => true,
			'separator' => "\n",
			'multiOptions' => array(
				'N' => 'Nascimento',
				'C' => 'Compra',
				'E' => 'Externo',
			),
		));

		/*
		 * xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		 */
		$this->addElement('hidden', 'pai_id');
		$this->addElement('text', 'pai_cod', array(
			'label' => 'Pai',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'pai', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('hidden', 'mae_id');
		$this->addElement('text', 'mae_cod', array(
			'label' => 'Mãe',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'mae', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('hidden', 'receptora_id');
		$this->addElement('text', 'receptora_cod', array(
			'label' => 'Receptora',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'receptora', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('textarea', 'obs', array(
			'label' => 'Observação',
			'filters' => array('StringTrim', 'StringToUpper'),
			'rows' => 7,
			'cols' => 50,
			'class'	=> 'input',
		));



	}

}
