<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

class Model_Grid
{

	private $name		= '';
	private $fields		= array();
	private $paginator	= null;
	private $sorting	= false;
	private $baseUrl	= null;
	private $edit		= false;
	private $delete		= false;
	private $add		= false;
	private $search		= false;
	private $genealogia	= false;
	private $orderby	= false;
	private $order		= false;
	private $action		= false;

	public function __construct($name)
	{

		$this->name = $name;

	}

	/**
	 * Set true to enable colum sorting
	 * 
	 * @param $sorting boolean
	 */
	public function setSorting($sorting)
	{
		$this->sorting = $sorting;
	}

	public function setBaseUrl($baseUrl)
	{
		$this->baseUrl = $baseUrl;
	}

	public function setPaginator($paginator)
	{
		$this->paginator = $paginator;
	}

	public function setFields(array $fields)
	{
		switch (is_array($fields))
		{
			case false:
				throw new Exception('$fields is not an array');
		}

		for ($i=0; $i < count($fields); $i++)
		{
			switch ($fields[$i] instanceof Model_Grid_Fields)
			{
				case false:
					throw new Exception('element at position: '.($i).' not is an Model_Grid_Fields object');
			}
		}
		$this->fields = $fields;
	}

	public function setEdit(array $edit)
	{
		if (!array_key_exists('module', $edit) || !array_key_exists('action', $edit)) {
			throw new Exception("Invalid Array model for edit");
		} else {
			$this->edit = $edit;
		}
	}

	public function setDelete(array $delete)
	{
		if (!array_key_exists('module', $delete) || !array_key_exists('action', $delete)) {
			throw new Exception("Invalid Array model for delete");
		} else {
			$this->delete = $delete;
		}
	}

	public function setAdd(array $add)
	{
		if (!array_key_exists('module', $add) || !array_key_exists('action', $add)) {
			throw new Exception("Invalid Array model for add");
		} else {
			$this->add = $add;
		}
	}

	public function setGenealogia($genealogia, $show = false)
	{
		if (!array_key_exists('module', $genealogia) || !array_key_exists('action', $genealogia)) {
			throw new Exception("Invalid Array model for genealogia");
		} else {
			$this->genealogia = $genealogia;
		}
	}

	public function setSearch($search)
	{
		$this->search = $search;
	}

	public function setAction($action)
	{
		$this->action = $action;
	}

	public function getAction()
	{
		return $this->action;
	}

	public function getSearch()
	{
		return $this->search;
	}

	public function getPaginator()
	{
		return $this->paginator;
	}

	public function getBaseUrl()
	{
		return $this->baseUrl;
	}

	public function getName()
	{
		return $this->name;
	}

	public function getDelete ()
	{
		return $this->delete;
	}

	public function getEdit ()
	{
		return $this->edit;
	}

	public function getAdd ()
	{
		return $this->add;
	}

	public function getSorting ()
	{
		return $this->sorting;
	}

	public function getFields ()
	{
		return $this->fields;
	}

	public function getGenealogia()
	{
		return $this->genealogia;
	}

}