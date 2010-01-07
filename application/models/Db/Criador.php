<?php

class Model_Db_Criador extends Model_Db
{

    protected $_name = 'criador';
    protected $_select = false;

    public function getCriadores($orderby = null, $order = null)
    {
        $query = $this->select()
            ->from($this->_name)
            ->order($orderby .' '. $order)
            ;
        $result = $this->fetchAll($query);
        return $result->toArray();
    }

    public function getCriador($id)
    {
        $id = (int)$id;
        $query = $this->select()
            ->setIntegrityCheck(false)
            ->from(array($this->_name, array('*'), $this->_schema))
            ->joinLeft(array('c' => 'aux_cidades'), 'criador.cidades_id = c.id', array(), $this->_schema)
            ->joinLeft(array('e' => 'aux_estados'), 'c.estado_id = e.id', array('uf' => 'id'), $this->_schema)

            ->joinLeft(array('cc' => 'aux_cidades'), 'criador.corresp_cidades_id = cc.id', array(), $this->_schema)
            ->joinLeft(array('ec' => 'aux_estados'), 'cc.estado_id = ec.id', array('corresp_uf' => 'id'), $this->_schema)

            ->where('criador.id = ?', $id)
            ;
		$row = $this->fetchRow($query);
		if (!$row) {
			throw new Exception("Count not find row $id");
		}
		$array = $row->toArray();
        foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
    }

	/**
     * 
     * @param $fields array()
     */
    public function listCriadores($cols = '*')
    {

        if (!is_array($cols)) {
            $cols = array($cols);
        }
        $this->_select = $this->select()
            ->from($this->_name, $cols);
        $array = $this->fetchAll($this->_select)->toArray();
        $return = array();
        for ($i=0; $i < count($array); $i++)
        {
            foreach ($array[$i] as $key => $val) {
    			$return[$i][$key] = utf8_decode($val);
    		}
        }
		return $return;
        
    }

	/**
     * Retorna uma array no formato exigido pelo flexigrid
     * 
     * @param $cols (array|string) colunas a serem retornadas
     * @param $orderby (string) nome da coluna a ser ordenada
     * @param $order (string) tipo de ordenacao asc ou desc
     * @param $page (int) numero da pagina atual
     * @param $limit (int) numero de registros por pagina
     * @param $qtype (string) nome do campo
     * @param $query (string) valor a ser procurado
     */
    public function listCriadoresJson($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false)
    {

        // se for string convert para array
        if (!is_array($cols)) {
            $cols = array($cols);
        }

        // verifica se existe uma coluna chamada ID
        foreach ($cols as $col) {
        	if ($col == 'id') {
        	    $col_id = $col;
        	}
        }

        // se nao existir uma coluna chamada ID ... cria a mesma
        if (!$col_id) {
            $col_id = 'id';
            $cols[] = $col_id;
        }

        $this->_select = $this->select()
            ->from($this->_name, $cols, $this->_schema)
        ;

        if ($orderby && $order) {
            $this->_select->order($orderby .' '. $order);
        }

        if ($qtype && $query) {
            if ($like == 'false') {
        		$this->_select->where($qtype .' = ?', $query);
        	} else {
        		$this->_select->where($qtype .' LIKE ?', '%'.$query.'%');
        	}
        }

        $return = array(
            'page' => $page,
            'total' => $this->fetchAll($this->_select)->count(),
        );

        if ($page && $limit) {
            $this->_select->limitPage($page, $limit);
        }

        $array = $this->fetchAll($this->_select)->toArray();
        for ($i=0; $i < count($array); $i++)
        {
            $row = $array[$i];

            $current = array(
                'id' => $row[$col_id]
            );
            foreach ($row as $key => $val)
            {
                if ($key == $col_id) {
                    continue;
                } else {
                    $current['cell'][] = ($val);
                }
            }
            $return['rows'][] = $current;
        }
		return $return;

    }

    public function updateCriador($post)
    {

        $data = array(        
    		'cod' => utf8_encode($post['cod']),
    		'dsc' => utf8_encode($post['dsc']),
        );

        $data['cpf_cnpj']           = $post['cpf_cnpj'];
        $data['rg']                 = utf8_encode($post['rg']);
        $data['fazenda']            = utf8_encode($post['fazenda']);
        $data['cidades_id']         = $post['cidades_id'];
        $data['corresp_endereco']   = utf8_encode($post['corresp_endereco']);
        $data['corresp_cidades_id'] = $post['corresp_cidades_id'];
        $data['corresp_cep']        = $post['corresp_cep'];
        $data['telefone']           = $post['telefone'];
        $data['celular']            = $post['celular'];
        $data['email']              = utf8_encode($post['email']);

        foreach ($data as $key => $val) {
        	if ($val == "") {
        	    $data[$key] = null;
        	}
        }

		$where = 'id = '.(int)$post['id'];
		$return = $this->update($data , $where);

    }

    public function addCriador($cod, $dsc, $cpf_cnpj, $rg, $cidades_id, $corresp_endereco, $corresp_cidades_id, $corresp_cep, $telefone, $celular, $email)
    {

        $data = array(
        	'cod'                => utf8_encode($cod),
        	'dsc'                => utf8_encode($dsc),
        	'cpf_cnpj'           => $cpf_cnpj,
        	'rg'                 => utf8_encode($rg),
        	'cidades_id'         => $cidades_id,
        	'corresp_endereco'   => utf8_encode($corresp_endereco),
        	'corresp_cidades_id' => $corresp_cidades_id,
        	'corresp_cep'        => $corresp_cep,
        	'telefone'           => $telefone,
        	'celular'            => $celular,
        	'email'              => $email,
        );
        foreach ($data as $key => $val) {
            if (is_string($val) && $val != "") {
                $data2[$key] = $val;
            } else {
                unset($data[$key]);
            }
        }
        $result = $this->insert($data);
        return true;

    }

    public function deleteCriador($id)
    {
        $this->delete('id = ' . (int)$id);
    }

}