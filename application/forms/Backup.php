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
class Form_Backup extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('backup');
		$this->setAttrib('enctype', 'multipart/form-data');

		$this->addElement('file', 'backupfile', array(
			'label' => 'Escolha o arquivo para restaurar',
		));

		$this->addElement('image', 'cancel', array(
			'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/cancel.gif',
		));

		$this->getElement('cancel')
			->removeDecorator('Label')
			->removeDecorator('Tag')
		;

		$this->addElement('image', 'submit', array(
			'image' => Zend_Controller_Front::getInstance()->getBaseUrl().'/images/button/save.gif',
		));

		$this->getElement('submit')
			->removeDecorator('Label')
			->removeDecorator('Tag')
		;
			
	}

}
