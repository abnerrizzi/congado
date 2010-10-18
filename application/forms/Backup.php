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
			
	}

}
