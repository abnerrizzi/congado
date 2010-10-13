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
class Form_ColetaEmbriao extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('coleta_de_embrioes');
		$this->addElement('hidden', 'id');

		$this->addElement('select', 'fazenda_id', array(
			'required' => true,
			'label' => 'Fazenda',
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'vaca_id');
		$this->addElement('text', 'vaca_cod', array(
			'label' => 'Vaca',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'vaca', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('text', 'dt_coleta', array(
			'label' => 'Coleta',
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

		$this->addElement('hidden', 'touro_id');
		$this->addElement('text', 'touro_cod', array(
			'label' => 'Touro',
			'filters' => array('StringTrim', 'Alnum'),
			'maxlength' => 16,
			'size' => 10,
			'class'	=> 'input',
		));
		$this->addElement('text', 'touro', array(
			'class'	=> 'input',
			'readonly' => 'readonly',
			'disable' => true,
		));

		$this->addElement('text', 'touro_fazenda_id', array(
			'label' => 'touro_fazenda_id',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'partida', array(
			'label' => 'partida',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'insemina_dh1d', array(
			'label' => 'Data',
			'filters' => array('StringTrim'),
			'maxlength' => 10,
			'size' => 10,
			'class'	=> 'input',
		));

		$this->addElement('text', 'insemina_dh1h', array(
			'label' => 'Hora',
			'filters' => array('StringTrim'),
			'maxlength' => 5,
			'size' => 4,
			'class'	=> 'input',
		));

		$this->addElement('text', 'dose1', array(
			'label' => 'Doses',
			'filters' => array('StringTrim'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'partida1', array(
			'label' => 'Partida',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'cdc1', array(
			'label' => 'cdc1',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'soro_nome', array(
			'label' => 'soro_nome',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'soro_partida', array(
			'label' => 'soro_partida',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'meio_nome', array(
			'label' => 'meio_partida',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'avalia_od', array(
			'label' => 'Ovário Direito',
			'filters' => array('StringTrim'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'avalia_oe', array(
			'label' => 'Ovário Esquerdo',
			'filters' => array('StringTrim'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'viavel', array(
			'label' => 'Viáveis',
			'filters' => array('StringTrim'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'nao_viavel', array(
			'label' => 'Não Viáveis',
			'filters' => array('StringTrim'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'fecundada', array(
			'label' => 'Fecundadas',
			'filters' => array('StringTrim'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'nao_fecundada', array(
			'label' => 'Não Fecundadas',
			'filters' => array('StringTrim'),
			'maxlength' => 4,
			'size' => 4,
			'class'	=> 'input_num',
		));

		$this->addElement('text', 'cdg', array(
			'label' => 'cdg',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'cdg_anterior', array(
			'label' => 'cdg_anterior',
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('hidden', 'obs', array(
			'label' => 'Observação',
			'filters' => array('StringTrim', 'StringToUpper'),
			'class'	=> 'input',
		));

	}

}
