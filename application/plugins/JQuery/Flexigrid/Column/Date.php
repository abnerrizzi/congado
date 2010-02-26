<?php

/**
 * @package Plugin
 * @subpackage Plugin_JQuery_Column
 */

/**
 * Classe para gerar a data formatada nas colunas do Flexigrid.
 * @author Tales Augusto <tales.augusto.santos@gmail.com>
 * @uses Plugin_JQuery_Column_Abstract
 * @package Plugin
 * @subpackage Plugin_JQuery_Column
 * @version $Id$
 * 
 */
class Plugin_JQuery_Flexigrid_Column_Date extends Plugin_JQuery_Flexigrid_Column_Abstract
{
	/**
	 * Objeto Locale
	 * 
	 * @access protected
	 *
	 * @var Zend_Locale
	 */
	protected $_locale;
	
	/**
	 * Formato da data
	 *
	 * @var string
	 */
	protected $_format = Zend_Date::DATES;

	/**
	 * Retorna o objeto de localização
	 * 
	 * @author Tales Augusto <tales.augusto.santos@gmail.com>
	 * 
	 * @access public
	 * 
	 * @return Zend_Locale
	 */
	public function getLocale()
	{
		if ( null === $this->_locale )
		{
			$this->setLocale(new Zend_Locale('auto'));
		}
		return $this->_locale;
	}

	/**
	 * Seta o objeto de localização
	 * 
	 * @author Tales Augusto <tales.augusto.santos@gmail.com>
	 * 
	 * @access public
	 * 
	 * @param Zend_Locale $locale
	 * 
	 * @return Zend_Locale
	 */
	public function setLocale(Zend_Locale $locale)
	{
		$this->_locale = $locale;
		return $this;
	}
	
	/**
	 * Seta o formato da data
	 *
	 * @param string $format Formato de data.
	 * 
	 * @return Zend_Locale
	 */
	public function setFormat($format = Zend_Date::DATES)
	{
		$this->_format = $format;
		return $this;
	}

	/**
	 * @see Plugin_JQuery_Column_Abstract::render
	 * 
	 * @author Rafael Campos <rcampos>
	 * 
	 * @access public
	 * 
	 * @param string $value
	 * 
	 * @return string
	 */
	public function render($value)
	{
		$locale = $this->getLocale();

		try
		{
			$objDate = new Zend_Date($value, null, $locale);
			$strDate = $objDate->get($this->_format);
		}
		catch (Exception $e)
		{
			$strDate = '-';
		}
		
		return (string) $strDate;
	}
}