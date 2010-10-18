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
class Form_Raca extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('racas');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'cod', array(
			'label' => 'Raca',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array(new Zend_Validate_Db_NoRecordExists('raca','cod')),
			'maxlength' => 3,
			'size' => 3,
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

		$this->addElement('text', 'sisbov', array(
			'label' => 'SISBOV',
			'filters' => array('StringTrim', 'StringToUpper'),
			'maxlength' => 8,
			'size' => 8,
			'class'	=> 'input',
		));

		$this->addElement('text', 'gestacao_min', array(
			'label' => 'Mínimo',
			'required' => true,
			'filters' => array('StringTrim', 'Digits'),
			'maxlength' => 8,
			'size' => 6,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'gestacao_med', array(
			'label' => 'Médio',
			'required' => true,
			'filters' => array('StringTrim', 'Digits'),
			'maxlength' => 8,
			'size' => 6,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'gestacao_max', array(
			'label' => 'Máximo',
			'required' => true,
			'filters' => array('StringTrim', 'Digits'),
			'maxlength' => 8,
			'size' => 6,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'peso_repro', array(
			'label' => 'Peso p/ Entrar em Reprodução',
			'required' => true,
			'filters' => array('StringTrim', 'Digits'),
			'size' => 8,
			'class' => 'input_num',
		));

		$this->addElement('text', 'idade_repro', array(
			'label' => 'Idade p/ Entrar em Reprodução',
			'required' => true,
			'filters' => array('StringTrim', 'Digits'),
			'size' => 8,
			'class' => 'input_num',
		));



		$this->addElement('text', 'pesom1', array(
			'required' => true,
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));

		$this->addElement('text', 'pesom2', array(
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));

		$this->addElement('text', 'pesom3', array(
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));

		$this->addElement('text', 'pesom4', array(
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));

		$this->addElement('text', 'pesom5', array(
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));

		$this->addElement('text', 'pesof1', array(
			'required' => true,
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
			'style' => 'text-align: rigth',
		));

		$this->addElement('text', 'pesof2', array(
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));

		$this->addElement('text', 'pesof3', array(
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));

		$this->addElement('text', 'pesof4', array(
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));

		$this->addElement('text', 'pesof5', array(
			'filters' => array('Digits'),
			'size' => 4,
			'class' => 'input_num',
		));


		$this->addElement('radio', 'grupo', array(
			'separator' => "\n",
			'multiOptions' => array(
				'N' => 'Nelorada',
				'A' => 'Adaptada',
				'B' => 'Britânica',
				'C' => 'Continental',
				'H' => 'Nenhuma',		// H do padrao congado
			),
		));

		$this->addElement('radio', 'compsanguinea', array(
			'separator' => "\n",
			'multiOptions' => array(
				'S' => 'Sim',
				'N' => 'Não',
			),
		));

	}

}
