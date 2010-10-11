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
class Form_SituacaoPesagem extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('tipos_de_situacao_a_pesagem');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'cod', array(
			'label' => 'Situação',
			'required' => true,
			'filters' => array('StringTrim', 'StringToUpper'),
			'validators' => array(new Zend_Validate_Db_NoRecordExists('situacaopesagem','cod')),
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

		$this->addElement('image', 'submit', array(
			'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/save.gif',
		));
		$this->getElement('submit')
			->removeDecorator('Label')
			->removeDecorator('Tag')
		;

		$this->addElement('image', 'cancel', array(
			'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/cancel.gif',
		));
		$this->getElement('cancel')
			->removeDecorator('Label')
			->removeDecorator('Tag')
		;

	}

}
