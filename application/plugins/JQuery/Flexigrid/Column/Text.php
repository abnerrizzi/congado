<?php

/**
 * Classe para gerar o texto nas colunas do Flexigrid.
 *
 * @author Tales Augusto <tales.augusto.santos@gmail.com>
 * 
 * @uses Plugin_JQuery_Column_Abstract
 * 
 * @filesource
 * 
 */
class Plugin_JQuery_Flexigrid_Column_Text extends Plugin_JQuery_Flexigrid_Column_Abstract
{
	/**
	 * @see Plugin_JQuery_Column_Abstract::render
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
		return (string) $value;
	}
}