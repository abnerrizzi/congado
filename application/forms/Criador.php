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
class Form_Criador extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('criador');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'cod', array(
			'label' => 'Criador',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array('Alnum', new Zend_Validate_Db_NoRecordExists('criador','cod')),
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

		$this->addElement('text', 'email', array(
			'label' => 'E-Mail',
			'filters' => array('StringTrim', 'StringToLower'),
			'validators' => array('EmailAddress'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('text', 'telefone', array(
			'label' => 'Telefone',
			'filters' => array('StringTrim', 'StringToLower', 'Digits'),
			'maxlength' => 10,
			'size' => 12,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'celular', array(
			'label' => 'Celular',
			'filters' => array('StringTrim', 'StringToLower', 'Digits'),
			'maxlength' => 10,
			'size' => 12,
			'class'	=> 'input_num',
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
			'filters' => array('StringToUpper'),
			'maxlength' => 11,
			'size' => 12,
			'class'	=> 'input',
		));

		$this->addElement('text', 'fazenda', array(
			'label' => 'Fazenda',
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 64,
			'size' => 64,
			'class'	=> 'input',
		));

		$this->addElement('select', 'uf', array(
			'label' => 'Retirar label',
			'class'	=> 'input',
		));

		$this->addElement('select', 'cidades_id', array(
			'label' => 'UF - Cidade',
			'class'	=> 'input',
		));

		$this->addElement('text', 'corresp_endereco', array(
			'label' => 'Endereço (Correspondência)',
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 64,
			'size' => 64,
			'class'	=> 'input',
		));

		$this->addElement('select', 'corresp_uf', array(
			'label' => 'Retirar label',
			'class'	=> 'input',
		));

		$this->addElement('select', 'corresp_cidades_id', array(
			'label' => 'UF - Cidade (Correspondência)',
			'class'	=> 'input',
		));

		$this->addElement('text', 'corresp_cep', array(
			'label' => 'CEP (Correspondência)',
			'filters' => array('StringTrim', 'StringToUpper', 'Digits'),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

	}

}
