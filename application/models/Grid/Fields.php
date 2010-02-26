<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Model_Grid_Fields
{

	private $colum;
	private $title;
	private $size;

	public function __construct($colum = false, $title = false, $size = 0)
	{
		if ($colum == false) {
			throw new Exception('Invalid $colum value in Model_Grid_Fields');
		}

		if ($title == false) {
			throw new Exception('Invalid $title value in Model_Grid_Fields');
		}

		$this->colum	= $colum;
		$this->title	= $title;
		$this->size		= (int)$size;

	}

	public function getSize ()
	{
		return $this->size;
	}

	public function getTitle ()
	{
		return $this->title;
	}

	public function getColum ()
	{
		return $this->colum;
	}


}