<?php

class Model_Db_Estado extends Model_Db
{

    protected $_name = 'aux_estados';
    protected $_select = false;

    public function getEstados()
    {
        $result = $this->fetchAll();
        return $result->toArray();
    }

}