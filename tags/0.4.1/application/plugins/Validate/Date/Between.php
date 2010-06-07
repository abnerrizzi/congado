<?php
/**
 * @package Plugin
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Plugin
 * @subpackage Validate
 * @version $Id: Between.php 197 2010-04-13 13:09:41Z bacteria_ $
 * 
 */

class Plugin_Validate_Date_Between extends Zend_Validate_Abstract
{

	/**
     * Validation failure message key for when the value is not between the min and max, inclusively
     */
    const NOT_BETWEEN        = 'notBetween';

	/**
     * Validation failure message key for when the value is not strictly between the min and max
     */
    const NOT_BETWEEN_STRICT = 'notBetweenStrict';

    /**
     * Validation failure message template definitions
     *
     * @var array
     */
    protected $_messageTemplates = array(
        self::NOT_BETWEEN        => "'%value%' is not between '%min%' and '%max%', inclusively",
        self::NOT_BETWEEN_STRICT => "'%value%' is not strictly between '%min%' and '%max%'"
    );

	/**
     * Additional variables available for validation failure messages
     *
     * @var array
     */
    protected $_messageVariables = array(
        'min' => '_min',
        'max' => '_max'
    );

    /**
     * Minimum value
     *
     * @var mixed
     */
    protected $_min;

    /**
     * Maximum value
     *
     * @var mixed
     */
    protected $_max;

    /**
     * Format value
     * 
     * @var mixed
     */
    protected $_format;

    /**
     * Whether to do inclusive comparisons, allowing equivalence to min and/or max
     *
     * If false, then strict comparisons are done, and the value may equal neither
     * the min nor max options
     *
     * @var boolean
     */
    protected $_inclusive;

    /**
     * Sets validator options
     *
     * @param  mixed   $min
     * @param  mixed   $max
     * @param  boolean $inclusive
     * @return void
     */
    public function __construct($min, $max, $format, $inclusive = true)
    {
        $this->setFormat($format)
        	 ->setMin($min)
             ->setMax($max)
             ->setInclusive($inclusive);
    }

    /**
     * Returns the min option
     *
     * @return mixed
     */
    public function getMin()
    {
        return $this->_min;
    }

    /**
     * Sets the min option
     *
     * @param  mixed $min
     * @return Zend_Validate_Between Provides a fluent interface
     */
    public function setMin($min)
    {
    	$unformated  = substr($min, strpos($this->_format, 'Y'), (strrpos($this->_format, 'Y') - strpos($this->_format, 'Y'))+1)
    				 . substr($min, strpos($this->_format, 'm'), (strrpos($this->_format, 'm') - strpos($this->_format, 'm'))+1)
    				 . substr($min, strpos($this->_format, 'd'), (strrpos($this->_format, 'd') - strpos($this->_format, 'd'))+1);
        $this->_min = $unformated;
        unset($unformated);
        return $this;
    }

    /**
     * Returns the max option
     *
     * @return mixed
     */
    public function getMax()
    {
        return $this->_max;
    }

    /**
     * Sets the max option
     *
     * @param  mixed $max
     * @return Zend_Validate_Between Provides a fluent interface
     */
    public function setMax($max)
    {
    	$unformated  = substr($max, strpos($this->_format, 'Y'), (strrpos($this->_format, 'Y') - strpos($this->_format, 'Y'))+1)
    				 . substr($max, strpos($this->_format, 'm'), (strrpos($this->_format, 'm') - strpos($this->_format, 'm'))+1)
    				 . substr($max, strpos($this->_format, 'd'), (strrpos($this->_format, 'd') - strpos($this->_format, 'd'))+1);
        $this->_max = $unformated;
        unset($unformated);
        return $this;
    }

    /**
     * Returns the format option
     * 
     * @return mixed
     */
    public function getFormat()
    {
    	return $this->_format;
    }

    /**
     * Sets the format option
     * 
     * @return string date format
     * @return Plugin_Validate_Date_Between
     */
    public function setFormat($format)
    {
    	$this->_format = $format;
    	return $this;
    }

    /**
     * Returns the inclusive option
     *
     * @return boolean
     */
    public function getInclusive()
    {
        return $this->_inclusive;
    }

    /**
     * Sets the inclusive option
     *
     * @param  boolean $inclusive
     * @return Zend_Validate_Between Provides a fluent interface
     */
    public function setInclusive($inclusive)
    {
        $this->_inclusive = $inclusive;
        return $this;
    }

    /**
     * Defined by Zend_Validate_Interface
     *
     * Returns true if and only if $value is between min and max options, inclusively
     * if inclusive option is true.
     *
     * @param  mixed $value
     * @return boolean
     */
    public function isValid($value)
    {
    	$unformated  = substr($value, strpos($this->_format, 'Y'), (strrpos($this->_format, 'Y') - strpos($this->_format, 'Y'))+1)
    				 . substr($value, strpos($this->_format, 'm'), (strrpos($this->_format, 'm') - strpos($this->_format, 'm'))+1)
    				 . substr($value, strpos($this->_format, 'd'), (strrpos($this->_format, 'd') - strpos($this->_format, 'd'))+1);
        $this->_setValue($unformated);

        if ($this->_inclusive) {
            if ($this->_min > $unformated || $this->_max < $unformated) {
                $x = $this->getMin();
                $_min = substr($x, 6, 2) ."/". substr($x, 4, 2) ."/". substr($x, 0,4);

                $x = $this->getMax();
                $_max = substr($x, 6, 2) ."/". substr($x, 4, 2) ."/". substr($x, 0,4);

                $this->_min = $_min;
                $this->_max = $_max;

                $this->_error(self::NOT_BETWEEN);
                return false;
            }
        } else {
            if ($this->_min >= $unformated ||  $this->_max <= $unformated) {
                $x = $this->getMin();
                $_min = substr($x, 6, 2) ."/". substr($x, 4, 2) ."/". substr($x, 0,4);

                $x = $this->getMax();
                $_max = substr($x, 6, 2) ."/". substr($x, 4, 2) ."/". substr($x, 0,4);

                $this->_min = $_min;
                $this->_max = $_max;

            	$this->_error(self::NOT_BETWEEN_STRICT);
                return false;
            }
        }
        return true;
    }

}
