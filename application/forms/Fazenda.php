<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Form_Fazenda extends Form_Default
{

	protected $_standardElementDecorator = array(
		'ViewHelper',
		'Errors',
		array(array('data' => 'HtmlTag'), array('tag' => 'td', 'class' => 'element')),
		array('Label', array('tag' => 'td')),
		array(array('row' => 'HtmlTag'), array('tag' => 'tr')),
	);

	protected $_buttonElementDecorator = array(
		'ViewHelper',
		array('decorator' => array('td' => 'HtmlTag'), 'options' => array('tag' => 'td', 'colspan'=>'2','align'=>'center')),
		'Label',
		array('decorator' => array('tr' => 'HtmlTag'), 'options' => array('tag' => 'tr')),
	);

	protected $_standardGroupDecorator = array(
		'FormElements',
		array('HtmlTag', array(
			'tag' => 'table',
			'align' => 'center',
			'class' => 'my_pre_defined_class',
			'border' => 1
		)),
		array('Fieldset', array('style' => 'width: 580px;'))
	);

	public function init()
	{
		$this->_initTranslator();
	}

	public function _initTranslator()
	{

		$translate = Zend_Registry::get('Zend_Translate');
		$this->setTranslator($translate);
	}

	public function __construct()
	{
		parent::__construct();
		$this->setName('fazenda');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'descricao', array(
			'label' => 'Descrição',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 64,
			'size' => 64,
			'class'	=> 'input',
		));

		$this->addElement('text', 'proprietario', array(
			'label' => 'Proprietário',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 40,
			'size' => 40,
			'class'	=> 'input',
		));

		$this->addElement('text', 'endereco', array(
			'label' => 'Endereço',
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
			'label' => 'Código SISBOV',
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