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
			throw new Zend_Db_Table_Exception("Count not find row $id");
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

	public function updateCriador($post)
	{

		$data = array(		
			'cod' => utf8_encode($post['cod']),
			'dsc' => utf8_encode($post['dsc']),
		);

		$data['cpf_cnpj']			= $post['cpf_cnpj'];
		$data['rg']					= utf8_encode($post['rg']);
		$data['fazenda']			= utf8_encode($post['fazenda']);
		$data['cidades_id']			= $post['cidades_id'];
		$data['corresp_endereco']	= utf8_encode($post['corresp_endereco']);
		$data['corresp_cidades_id']	= $post['corresp_cidades_id'];
		$data['corresp_cep']		= $post['corresp_cep'];
		$data['telefone']			= $post['telefone'];
		$data['celular']			= $post['celular'];
		$data['email']				= utf8_encode($post['email']);

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
			'cod'					=> utf8_encode($cod),
			'dsc'					=> utf8_encode($dsc),
			'cpf_cnpj'				=> $cpf_cnpj,
			'rg'					=> utf8_encode($rg),
			'cidades_id'			=> $cidades_id,
			'corresp_endereco'		=> utf8_encode($corresp_endereco),
			'corresp_cidades_id'	=> $corresp_cidades_id,
			'corresp_cep'			=> $corresp_cep,
			'telefone'				=> $telefone,
			'celular'				=> $celular,
			'email'					=> $email,
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

	public function getCods(array $ids)
	{
		$query = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, array('id', 'cod'), $this->_schema)
			;

		foreach ($ids as $id) {
			$query->orWhere('id = ?', (int)$id);
		}

		$rows = $this->fetchAll($query);
		if (!$rows) {
			throw new Exception("Count not find rows");
		}
		$array = $rows->toArray();
		foreach ($rows as $row) {
			$row = $row->toArray();
			$return[$row['id']] = utf8_decode($row['cod']);
		}
		return $return;
	}

}
