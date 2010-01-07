<?php

class Model_Db_Ativagricola extends Model_Db
{

    protected $_name = 'ativagricola';
    protected $_select = false;

    public function getAtivagricolas($orderby = null, $order = null)
    {
        $query = $this->select()
            ->from($this->_name)
            ->order($orderby .' '. $order)
            ;
        $result = $this->fetchAll($query);
        return $result->toArray();
    }

    public function getAtivagricola($id)
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

    public function updateAtivagricola($post)
    {
        $data = array(
    		'cod'=> utf8_encode($post['cod']),
    		'dsc'=> utf8_encode($post['dsc'])
        );
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
    }

    public function addAtivagricola($cod, $dsc)
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

    public function deleteAtivagricola($id)
    {
        $this->delete('id = ' . intval($id));
    }

}