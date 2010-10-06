<?php 
/**
 * @package Plugin
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Plugin
 * @subpackage Validate
 * @version $Id$
 * 
 */

class Plugin_Validate_CnpjCpf extends Zend_Validate_Abstract
{

	const NUM_DIGITOS_CPF  = 11;
	const NUM_DIGITOS_CNPJ = 14;
	const NUM_DGT_CNPJ_BASE = 8;

	const INVALID_DIGITS = 'i_number';
	const INVALID_FORMAT = 'i_format';


	private $_skipFormat  = true;
	private $_patternCpf  = '/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/i';
	private $_patternCnpj = '/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})-(\d{2})/i';

	protected $_messageTemplates = array(
	);

	public function __construct($skipFormat = true) {
		$this->_skipFormat = $skipFormat;
	}

	public function isValid($value)
	{

		if (strlen(preg_replace("/[.-]/","",$value)) > self::NUM_DIGITOS_CPF) {
			return $this->isCnpj(preg_replace("/[.-]/","",$value));
		} else {
			return $this->isCpf(preg_replace("/[.-]/","",$value));
		}
		$this->_setValue($value);
		$this->_error(self::INVALID_FORMAT);
		$this->_messageTemplates = array(
			self::INVALID_FORMAT => "O valor informado '%value%' não é válido"
		);
		return false;
//		if ($this->isCnpf($value)) {
//			return true;
//		} elseif ($this->isCpf($value)) {
//			return true;
//		} else {
//			return false;
//		}

	}

	protected function isCpf($value)
	{
		$this->_messageTemplates = array(
			self::INVALID_DIGITS => "O CPF '%value%' não é válido",
			self::INVALID_FORMAT => "O formato do CPF '%value%' não é válido"
		);
		
		$this->_setValue ( $value );
		if (!$this->_skipFormat && preg_match($this->_patternCpf, $value) == false) {
			$this->_error(self::INVALID_FORMAT);
			return false;
		} elseif (strlen($value) < 9) {
			$this->_error(self::INVALID_FORMAT);
			$this->_messageTemplates = array(
				self::INVALID_FORMAT => "O valor informado '%value%' não é válido"
			);
			return false;
		} elseif (intval($value) < 1) {
			$this->_error(self::INVALID_FORMAT);
			return false;
		}

		$digits = preg_replace('/[^\d]+/i', '', $value);
		$firstSum = 0;
		$secondSum = 0;

		for ($i=0; $i<9; $i++)
		{
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

	protected function isCnpj($value)
	{
		$this->_messageTemplates = array(
			self::INVALID_DIGITS => "O CNPJ '%value%' não é válido",
			self::INVALID_FORMAT => "O formato do CNPJ '%value%' não é válido"
		);
		$this->_setValue ( $value );
		if (!$this->_skipFormat && preg_match($this->_patternCnpj, $value) == false) {
			$this->_error(self::INVALID_FORMAT);
			return false;
		} elseif (strlen($value) < 14) {
			$value = str_repeat('0', (self::NUM_DIGITOS_CNPJ - strlen($value)));
			$this->_setValue ( $value );
		}
		$digits = preg_replace('/[^\d]+/i', '', $value);
		$firstSum = 0;
		$secondSum = 0;
		$firstSum += (5*$digits{0}) + (4*$digits{1}) + (3*$digits{2}) + (2*$digits{3});
		$firstSum += (9*$digits{4}) + (8*$digits{5}) + (7*$digits{6}) + (6*$digits{7});
		$firstSum += (5*$digits{8}) + (4*$digits{9}) + (3*$digits{10}) + (2*$digits{11});
		$firstDigit = 11 - fmod($firstSum, 11);
		if ($firstDigit>= 10) {
			$firstDigit = 0;
		}
		$secondSum += (6*$digits{0}) + (5*$digits{1}) + (4*$digits{2}) + (3*$digits{3});
		$secondSum += (2*$digits{4}) + (9*$digits{5}) + (8*$digits{6}) + (7*$digits{7});
		$secondSum += (6*$digits{8}) + (5*$digits{9}) + (4*$digits{10}) + (3*$digits{11});
		$secondSum += ($firstDigit*2);
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
