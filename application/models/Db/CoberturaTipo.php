<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Db
 * @version $Id: Estado.php 457 2010-10-06 14:35:29Z bacteria_ $
 * 
 */
class Model_Db_CoberturaTipo extends Model_Db
{

	protected $_name = 'cobertura_tipo';
	protected $_select = false;

	public function getTipos()
	{
		$result = $this->fetchAll();
		$rows = $result->toArray();
		foreach ($rows as $row)
		{
			foreach ($row as $key => $value)
			{
				$row[$key] = utf8_decode($value);
			}
			$return[] = $row;
		}
		return $return;
	}

}
