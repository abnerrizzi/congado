<?php

class Model_Db extends Zend_Db_Table_Abstract
{

    public function init()
    {
        $db = Zend_Registry::get('database');
        $db = $db->getConfig();
        $this->_schema = $db['dbname'];
    }
}