<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Model_Db_User extends Model_Db
{

	protected $_name = 'user';
	protected $_select = false;

	public function updateLastLogin($user_id)
	{
		if ((int)$user_id > 0) {
			$data['lastlogin'] = new Zend_Db_Expr('NOW()');
			$where = array(
				'id' => (int)$user_id
			);

			return $this->update($data, $where);
		}
	}

	public function getLastLogin($user_id)
	{
		$this->_select = $this->select()
			->from($this->_name, array('lastlogin'), $this->_schema)
			->where('id = ?', (int)$user_id)
		;

		$row = $this->fetchRow($this->_select)->toArray();
		print $this->getDefinition();
		return $row['lastlogin'];
	}

	public function getUser($id)
	{
		$id = (int)$id;
		$row = $this->fetchRow('id = ' . $id);
		if (!$row) {
			throw new Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

}