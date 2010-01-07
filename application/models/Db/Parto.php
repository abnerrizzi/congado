<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version: $Id$
 * 
 */

class Model_Db_Parto extends Model_Db
{

    protected $_name = 'parto';
    protected $_select = false;

    public function getPartos($orderby = null, $order = null)
    {
        $query = $this->select()
            ->from($this->_name)
            ->order($orderby .' '. $order)
            ;
        $result = $this->fetchAll($query);
        return $result->toArray();
    }

    public function getParto($id)
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

    public function updateParto($post)
    {
        $data = array(
    		'cod'=> utf8_encode($post['cod']),
    		'dsc'=> utf8_encode($post['dsc'])
        );
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
    }

    public function addParto($cod, $dsc)
    {

        $data = array(
        	'cod' => utf8_encode($cod),
        	'dsc' => utf8_encode($dsc)
        );

        if ($this->insert($data)) {
            return true;
        } else {
            return false;
        }

    }

    public function deleteParto($id)
    {
        $this->delete('id = ' . intval($id));
    }

}