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
class Form_Fazenda extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('fazenda');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'descricao', array(
			'label' => 'Descri��o',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 64,
			'size' => 64,
			'class'	=> 'input',
		));

		$this->addElement('text', 'proprietario', array(
			'label' => 'Propriet�rio',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 40,
			'size' => 40,
			'class'	=> 'input',
		));

		$this->addElement('text', 'endereco', array(
			'label' => 'Endere�o',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 64,
			'size' => 64,
			'class'	=> 'input',
		));

		$this->addElement('select', 'uf', array(
			'label' => 'Retirar label',
			'required' => true,
			'class'	=> 'input',
		));

		$this->addElement('select', 'cidades_id', array(
			'label' => 'UF - Cidade',
			'required' => true,
			'class'	=> 'input',
		));

		$this->addElement('text', 'cpf_cnpj', array(
			'label' => 'CPF/CNPJ',
			'filters' => array('StringTrim', 'StringToUpper', 'Digits'),
			'maxlength' => 18,
			'size' => 18,
			'class'	=> 'input_num',
		));
		$this->getElement('cpf_cnpj')->setValidators(array(new Plugin_Validate_CnpjCpf()));

		$this->addElement('text', 'rg', array(
			'label' => 'RG',
			'filters' => array('StringTrim', 'StringToUpper', 'Alnum'),
			'maxlength' => 11,
			'size' => 11,
			'class'	=> 'input',
		));

		$this->addElement('text', 'sisbov', array(
			'label' => 'C�digo SISBOV',
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('text', 'nirf', array(
			'label' => 'NIRF',
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 8,
			'size' => 8,
			'class'	=> 'input',
		));


	}

}
