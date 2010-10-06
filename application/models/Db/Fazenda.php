<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Db
 * @version $Id$
 * 
 */
class Model_Db_Fazenda extends Model_Db
{

	protected $_name = 'fazenda';
	protected $_select = false;
	protected $_dependentTables = array('aux_cidades');

	public function getPaginatorAdapter($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('f' => $this->_name), array('id', 'descricao'), $this->_schema)
			->join(array('c' => 'aux_cidades'), 'f.cidades_id = c.id', array('cidade' => 'nome'), $this->_schema)
			->join(array('e' => 'aux_estados'), 'c.estado_id = e.id', array('uf'), $this->_schema)
			->order('f.'.$orderby .' '. $order)
			;

		return $this->_select;
	}

	public function getFazendas($orderby = null, $order = null)
	{
		$query = $this->select()
			->setIntegrityCheck(false)
			->from(array('f' => $this->_name), array('id', 'descricao'), $this->_schema)
			->join(array('c' => 'aux_cidades'), 'f.cidades_id = c.id', array('cidade' => 'nome'), $this->_schema)
			->join(array('e' => 'aux_estados'), 'c.estado_id = e.id', array('uf'), $this->_schema)
			->order('f.'.$orderby .' '. $order)
		;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	/**
	 * 
	 * @param $fields array()
	 */
	public function listFazendas($cols = '*')
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

	public function getFazenda($id)
	{
		$id = (int)$id;
		$query = $this->select()
			->setIntegrityCheck(false)
			->from(array('f' => $this->_name), array('*'), $this->_schema)
			->join(array('c' => 'aux_cidades'), 'f.cidades_id = c.id', array(), $this->_schema)
			->join(array('e' => 'aux_estados'), 'c.estado_id = e.id', array('uf' => 'id'), $this->_schema)
			->where('f.id = ?', $id)
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

	public function updateFazenda($post)
	{
		$data = array(
			'descricao'		=> utf8_encode($post['descricao']),
			'proprietario'	=> utf8_encode($post['proprietario']),
			'endereco'		=> utf8_encode($post['endereco']),
			'cidades_id'	=> $post['cidades_id'],
			'cpf_cnpj'		=> $post['cpf_cnpj'],
			'rg'			=> $post['rg'],
			'sisbov'		=> $post['sisbov'],
			'nirf'			=> $post['nirf'],
		);

		if ($data['cpf_cnpj'] == '') {
			unset($data['cpf_cnpj']);
		}

		$where = 'id = '.intval($post['id']);
		$return = $this->update($data , $where );
	}

	public function addFazenda($descricao, $proprietario, $endereco, $cidades_id, $cpf_cnpj, $rg, $sisbov, $nirf)
	{

		$data = array(
			'descricao'		=> utf8_encode($descricao),
			'proprietario'	=> utf8_encode($proprietario),
			'endereco'		=> utf8_encode($endereco),
			'cidades_id'	=> $cidades_id,
			'cpf_cnpj'		=> $cpf_cnpj,
			'rg'			=> $rg,
			'sisbov'		=> $sisbov,
			'nirf'			=> $nirf,
		);

		if ($data['cpf_cnpj'] == '') {
			unset($data['cpf_cnpj']);
		}

		$result = $this->insert($data);
		return true;
	}

	public function deleteFazenda($id)
	{
		$this->delete('id = ' . (int)$id);
	}

	private function checkCodFazenda($cod)
	{
		$query = $this->select()
			->from($this->_name)
			->where('cod = ?', utf8_encode($cod))
		;
		$result = $this->fetchAll($query);

		if ($result->count() > 0) {
			return false;
		} else {
			return true;
		}
		
	}

}
