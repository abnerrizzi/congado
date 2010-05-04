<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Db
 * @version $Id: Movimentacao.php 205 2010-04-13 14:31:30Z bacteria_ $
 * 
 */
class Model_Db_Sanitario extends Model_Db
{

	protected $_name = 'sanitario';
	protected $_select = false;
	protected $_tipo = false;

	public function setTipo($tipo)
	{
		$this->_tipo = intval($tipo);
	}

	private function getTipo()
	{
		return $this->_tipo;
	}

	public function getPaginatorAdapter($orderby = null, $order = null, $cols = '*')
	{

		if (!is_array($cols)) {
			$cols = array($cols);
		}

		$select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, $cols, $this->_schema)
			->joinLeft(array('t' => 'sanitario_tipo'), 'tipo_id = t.id', array(), $this->_schema)
			->joinLeft(array('f' => 'fichario'), 'fichario_id = f.id', array('nome'), $this->_schema)
			->joinLeft(array('d' => 'doenca'), 'ocorrencia_id = d.id', array('doenca' => 'dsc'), $this->_schema)
		;

		if ($this->getTipo() == 0) {
			$select->joinLeft(
				array('s' => 'morte'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 1) {
			$select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 2) {
			$select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} else {
			throw new Zend_Db_Table_Exception('Tipo de movimentação não definido: (' . $this->getTipo() . ')');
		}
		$select->where("tipo_id = ?", $this->getTipo());

		if ($orderby != null && $order != null) {
			$select->order($orderby .' '. $order);
		}

		return $select;

	}

	public function getSanitario($id)
	{

		$id = (int)$id;

		$select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, array('id', 'fazenda_id', 'fichario_id', 'tipo_id', 'sequencial',
			'data' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
			'ocorrencia_id', 'comentario',
			'dataproximo' => new Zend_Db_Expr("DATE_FORMAT(dataproximo, '%d/%m/%Y')"),
			'old', 'tiposisbov'), $this->_schema)
			->joinLeft(array('t' => 'sanitario_tipo'), 'tipo_id = t.id', array(), $this->_schema)
			->joinLeft(array('f' => 'fichario'), 'fichario_id = f.id', array('fichario_cod' => 'cod', 'fichario' => 'nome'), $this->_schema)
			->joinLeft(array('d' => 'doenca'), 'ocorrencia_id = d.id', array('ocorrencia_cod' => 'cod', 'ocorrencia' => 'dsc'), $this->_schema)
		;

		if ($this->getTipo() == 0) {
			$select->joinLeft(
				array('s' => 'morte'),
				'sequencia_id = s.id',
				array('sequencia_id'  => 's.id', 'sequencia_cod' => 's.cod', 'sequencia'  => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 1) {
			$select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('sequencia_id'  => 's.id', 'sequencia_cod' => 's.cod', 'sequencia'  => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 2) {
			$select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('sequencia_id'  => 's.id', 'sequencia_cod' => 's.cod', 'sequencia'  => 's.dsc'),
				$this->_schema
			);
		} else {
			throw new Zend_Db_Table_Exception('Tipo de movimentação não definido: (' . $this->getTipo() . ')');
		}
		$select->where("tipo_id = ?", $this->getTipo());
		$select->where("$this->_name.id = ?", $id);
		
		$row = $this->fetchRow($select);
		if (!$row) {
			throw new Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function updateSanitario($values)
	{
		$_dt = explode('/', $values['data']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$data = array(
			'data' 			=> $_dt,
			'sequencia_id'	=> (int)$values['sequencia_id'],
			'comentario'	=> utf8_encode($values['comentario']),
		);
		$where = $this->getAdapter()->quoteInto('id = ?', (int)$values['id']);
		
		$this->update($data, $where);
	}

	public function addSanitarioMorte($post)
	{
		$_dt = explode('/', $post['data']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$posts = array (
			'fichario_id'		=> $post['fichario_id'],
			'data'				=> $_dt,
			'ocorrencia_id'		=> $post['ocorrencia_id'],
			'sequencia_id'		=> $post['sequencia_id'],
			'comentario'		=> $post['comentario'],
			'tiposisbov'		=> $post['tiposisbov'],
			'tipo_id'			=> $this->getTipo(),
		);

		foreach ($posts as $key => $val) {
			if ($val == '' && !is_int($val)) {
				continue;
			} else {
				$data[$key] = utf8_encode($val);
			}
		}

		if ($this->insert($data)) {
			return true;
		} else {
			return false;
		}
	}
}