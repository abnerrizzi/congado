<?php
/**
 * @package Plugin
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Plugin
 * @subpackage Plugin_Validate
 * @version $Id$
 * 
 */

class Plugin_Validate_Cpf extends Zend_Validate_Abstract
{

	const INVALID_DIGITS = 'i_number';
	const INVALID_FORMAT = 'i_format';

	protected $_messageTemplates = array(
		self::INVALID_DIGITS => "O cpf '%value%' não é válido",
		self::INVALID_FORMAT => "O formato de cpf '%value%' não é válido",
	);

	private $_pattern = '/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/i';
	private $_skipFormat = false;

	/**
	 * Inicializa a instância do validador
	 *
	 * @param bool $skipFormat fazer validação no formato?
	 */
	public function __construct($skipFormat = false) {
		$this->_skipFormat = $skipFormat;
	}


	/**
	 * verifica se o cpf é válido
	 *
	 * @param string $value cpf a ser validado
	 * @return bool
	 */
	public function isValid($value)
	{
		$this->_setValue ( $value );
		if (!$this->_skipFormat && preg_match($this->_pattern, $value) == false) {
			$this->_error(self::INVALID_FORMAT);
			return false;
		}
		$digits = preg_replace('/[^\d]+/i', '', $value);
		$firstSum = 0;
		$secondSum = 0;
		for ($i=0; $i<9; $i++) {
			$firstSum += $digits{$i} * (10 - $i);
			$secondSum += $digits{$i} * (11 - $i);
		}
		$firstDigit = 11 - fmod($firstSum, 11);
		if ($firstDigit>= 10) {
			$firstDigit = 0;
		}
		$secondSum = $secondSum + ($firstDigit*2);
		$secondDigit = 11 - fmod($secondSum, 11);
		if ($secondDigit>= 10) {
			$secondDigit = 0;
		}
		if (substr($digits, -2) != ($firstDigit . $secondDigit)) {
			$this->_error(self::INVALID_DIGITS);
			return false;
		}
		return true;
	}

}
