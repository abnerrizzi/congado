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
class Form_User extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('configuracoes_de_usuario');
		$this->setAttrib('enctype', 'multipart/form-data');
		$this->addElement('hidden', 'id');

		$this->addElement('text', 'login', array(
			'label' => 'Login',
			'required' => true,
			'filters' => array('StringTrim'),
			'validators' => array(new Zend_Validate_Db_NoRecordExists('user','login')),
			'size' => 16,
			'class'	=> 'input',
		));

		$this->addElement('text', 'name', array(
			'label' => 'Nome de usuário',
			'required' => true,
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('password', 'newpass', array(
			'label' => 'Nova Senha',
			'value' => false,
			'required' => false,
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('password', 'oldpass', array(
			'label' => 'Senha Atual',
			'value' => false,
			'required' => false,
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('password', 'confirmpass', array(
			'label' => 'Confirmação da Senha',
			'value' => false,
			'required' => false,
			'filters' => array('StringTrim'),
			'maxlength' => 32,
			'size' => 32,
			'class'	=> 'input',
		));

		$this->addElement('text', 'perpage', array(
			'label' => 'Registros por página',
			'required' => false,
			'filters' => array('Int'),
			'maxlength' => 3,
			'size' => 4,
			'class' => 'input'
		));

		$this->addElement('checkbox', 'admin', array(
			'label' => 'Administrador',
		));

		$this->addElement('image', 'delete', array(
			'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/delete.gif',
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

		$this->getElement('delete')
			->removeDecorator('Label')
			->removeDecorator('Tag')
		;
	}

}
