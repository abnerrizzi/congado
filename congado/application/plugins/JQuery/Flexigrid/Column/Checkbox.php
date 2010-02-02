<?php

/**
 * Classe para gerar o checkbox nas colunas do Flexigrid.
 *
 * @author Tales Augusto <tales.augusto.santos@gmail.com>
 * 
 * @uses Plugin_JQuery_Column_Abstract
 *
 * @version: $Id: Checkbox.php 52 2010-01-25 19:53:43Z bacteria_ $
 * 
 * @filesource
 * 
 * @version: $Id: Checkbox.php 52 2010-01-25 19:53:43Z bacteria_ $
 * 
 */

class Plugin_JQuery_Flexigrid_Column_Checkbox extends Plugin_JQuery_Flexigrid_Column_Abstract
{
	/**
	 * Condicao para definir se o checkbox estara checado ou nao.
	 *
	 * @access protected
	 *
	 * @var unknown_type
	 */
	protected $_conditionToCheck = 1;
	
	/**
	 * Define a condicao para definir se o checkbox estara checado ou nao.
	 * 
	 * @author Tales Augusto <tales.augusto.santos@gmail.com>
	 * 
	 * @access public
	 *
	 * @param mixed $value
	 * 
	 * @return Plugin_JQuery_Column_Checkbox
	 */
	public function setConditionToCheck($value)
	{
		$this->_conditionToCheck = $value;
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
		
		if ( !strstr($name, '[]') )
		{
			$name .= '[]';
		}
		
		$attribs = $this->_elementAttribs;
		if ( !isset($attribs['checked']) )
		{
			$attribs['checked'] = ($this->_conditionToCheck == $value);
		}
		
		$checkbox = $view->formCheckbox($name, $value, $attribs);
		return $checkbox;
	}
}