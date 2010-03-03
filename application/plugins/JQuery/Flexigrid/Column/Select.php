<?php

/**
 * @package Plugin
 */

/**
 * Classe para gerar o select nas colunas do Flexigrid.
 *
 * @author Tales Augusto <tales.augusto.santos@gmail.com>
 * @uses Plugin_JQuery_Column_Abstract
 * @package Plugin
 * @subpackage JQuery
 * @version $Id$
 * 
 */
class Plugin_JQuery_Flexigrid_Column_Select extends Plugin_JQuery_Flexigrid_Column_Abstract
{
	/**
	 * Opções do select
	 * 
	 * @access private
	 *
	 * @var array
	 */
	private $_multiOptions = array();

	/**
	 * Seta as opções do select.
	 * 
	 * @author Tales Augusto <tales.augusto.santos@gmail.com>
	 * 
	 * @access public
	 *
	 * @param array $options Array chave/valor para montar os options do select
	 * 
	 * @return Plugin_JQuery_Column_Select
	 */
	public function setMultiOptions(array $options)
	{
		$this->_multiOptions = $options;
		return $this;
	}

	/**
	 * @see Plugin_JQuery_Column_Abstract::render.
	 * 
	 * @author Tales Augusto <tales.augusto.santos@gmail.com>
	 * 
	 * @access public
	 *
	 * @param string $value
	 * 
	 * @return string
	 */
	public function render($value)
	{
		$view = $this->getView();
		$name = $this->getName();
		
		$select = $view->formSelect($name, $value, $this->_elementAttribs, $this->_multiOptions);
		return $select;
	}
}