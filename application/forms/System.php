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
class Form_System extends Form_Default
{

	public function __construct()
	{
		parent::__construct();
		$this->setName('configuracoes_do_sistema');
		$this->setAttrib('enctype', 'multipart/form-data');
		$this->addElement('hidden', 'id');

		$this->addElement('file', 'background', array(
			'label' => 'Papel de parede',
			'validators' => array('IsImage'),
			'validators' => array(array('Size', false, 4194304)) // maximo de 4 MB
		));

	}

}
