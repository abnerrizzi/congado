<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id: Parto.php 10 2010-01-08 13:06:35Z bacteria_ $
 * 
 */

class Model_Db_System extends Model_Db
{

	protected $_name = 'system';
	protected $_select = false;
	public static $filePath = '';

	public function getProperty($property = false)
	{
		if (!$property) {
			throw new Zend_Db_Exception('property not passed');
		} else {
			$this->_select = $this->select()
				->where('property = ?', $property);
			$result = $this->fetchRow($this->_select);
			if (count($result) > 0) {
				$return = array();
				var_dump($result);
				die();
				foreach ($result as $key => $value) {
					$return[$key] = utf8_encode($value);
				}
				return $return;
			} else {
				return false;
			}
		}
	}

	public function setBackupground($content, $type)
	{
		$this->_select = $this->select()->where('property = ?', 'background');
		$row = $this->fetchAll($this->_select);
		$data = array(
			'parameters1' => $content,
			'parameters2' => $type,
			'parameters3' => time(),
		);

		$where = "property = 'background'";

		if ($row->count() > 0) {
			$this->update($data, $where);
		} else {
			$data['property'] = 'background';
			$this->insert($data);
		}

		$this->cacheBackground($data['parameters3'], $data['parameters1']);
		return true;
	}

	public function getBackupground()
	{
		$_cols = array(
			'parameters1' => 'content',
			'parameters2' => 'type',
			'parameters3' => 'time',
		);

		$this->_select = $this->select($_cols)
			->where('property = ?', 'background');
		$result = $this->fetchRow($this->_select);
		if (count($result) > 0) {
			return $result->toArray();
		} else {
			return false;
		}
	}

	public function getBackupgroundTime()
	{
		$_cols = array(
			'time' => 'parameters3',
		);

		$this->_select = $this->select()
			->from($this->_name, $_cols, $this->_schema)
			->where('property = ?', 'background');
		$result = $this->fetchRow($this->_select);
		if (count($result) > 0) {
			$x = $result->toArray();
			return $x['time'];
		} else {
			return false;
		}
	}

	public function getBackupgroundContent()
	{
		$_cols = array(
			'content' => 'parameters1',
		);

		$this->_select = $this->select()
			->from($this->_name, $_cols, $this->_schema)
			->where('property = ?', 'background');
		$result = $this->fetchRow($this->_select);
		if (count($result) > 0) {
			$x = $result->toArray();
			return $x['content'];
		} else {
			return false;
		}
	}

	public function cacheBackground($time = false, $content = false)
	{
		if ($time === false) {
			$time = $this->getBackupgroundTime();
		}
		$dir = realpath(APPLICATION_PATH . '/../scripts');
		$file = "wallpaper";
		$filePath = $dir . '/' . $file;
		self::$filePath = $filePath;
		if (!file_exists($filePath) || $time > filemtime($filePath)) {
			$handle = fopen($filePath, 'w+');
			fwrite($handle, $this->getBackupgroundContent());
			fclose($handle);
		}
		return true;
	}

	public function getBackupgroundMimeType()
	{
		$_cols = array(
			'mime' => 'parameters2',
		);

		$this->_select = $this->select()
			->from($this->_name, $_cols, $this->_schema)
			->where('property = ?', 'background');
		$result = $this->fetchRow($this->_select);
		if (count($result) > 0) {
			$x = $result->toArray();
			return $x['mime'];
		}
	}
	
}
