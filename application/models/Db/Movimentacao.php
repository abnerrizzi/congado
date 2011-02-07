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
class Model_Db_Movimentacao extends Model_Db
{

	protected $_name = 'movimentacao';
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

		foreach ($cols as $key => $val) {
			if ($val == 'data') {
				$cols[$val] = "DATE_FORMAT($val, '%d/%m/%Y')";
			} else {
				$cols[$key] = $val;
			}
		}

		$this->_select
			->setIntegrityCheck(false)
			->from($this->_name, $cols, $this->_schema)
			->joinLeft(array('t' => 'movimentacao_tipo'), 'tipo_id = t.id', array(), $this->_schema)
			->joinLeft(array('f' => 'fichario'), 'fichario_id = f.id', array('nome'), $this->_schema)
		;

		if ($this->getTipo() == 0) {
			$this->_select->joinLeft(
				array('o' => 'categoria'),
				'old = o.id',
				array('old' => 'o.dsc'),
				$this->_schema
			);
			$this->_select->joinLeft(
				array('n' => 'categoria'),
				'new = n.id',
				array('new' => 'n.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 1) {
			$this->_select->joinLeft(
				array('o' => 'categoria'),
				'old = o.id',
				array('old' => 'o.dsc'),
				$this->_schema
			);
			$this->_select->joinLeft(
				array('n' => 'categoria'),
				'new = n.id',
				array('new' => 'n.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 4) {
			$this->_select->joinLeft(
				array('o' => 'local'),
				'old = o.id',
				array('old' => 'o.dsc'),
				$this->_schema
			);
			$this->_select->joinLeft(
				array('n' => 'local'),
				'new = n.id',
				array('new' => 'n.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 5) {
			$this->_select->joinLeft(
				array('o' => 'lote'),
				'old = o.id',
				array('old' => 'o.dsc'),
				$this->_schema
			);
			$this->_select->joinLeft(
				array('n' => 'lote'),
				'new = n.id',
				array('new' => 'n.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 7) {
			$this->_select->joinLeft(
				array('o' => 'fazenda'),
				'old = o.id',
				array('old' => 'o.descricao'),
				$this->_schema
			);
			$this->_select->joinLeft(
				array('n' => 'fazenda'),
				'new = n.id',
				array('new' => 'n.descricao'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 8) {
			$this->_select->joinLeft(
				array('o' => 'rebanho'),
				'old = o.id',
				array('old' => 'o.dsc'),
				$this->_schema
			);
			$this->_select->joinLeft(
				array('n' => 'rebanho'),
				'new = n.id',
				array('new' => 'n.dsc'),
				$this->_schema
			);
		} else {
			throw new Zend_Db_Table_Exception('Tipo de movimentação não definido: (' . $this->getTipo() . ')');
		}
		$this->_select->where("tipo_id = ?", $this->getTipo());

		if ($orderby != null && $order != null) {
			$this->_select->order($orderby .' '. $order);
		}

		return $this->_select;

	}

	public function getMovimentacoesxxx($orderby = null, $order = null)
	{
		$query = $this->select()
			->from($this->_name)
			->order($orderby .' '. $order)
			->joinLeft(array('t' => 'movimentacao_tipo'),'tipo_id = t.id')
			;
		$result = $this->fetchAll($query);
		return $result->toArray();
	}

	public function getMovimentacaoxxx($id)
	{
		$id = (int)$id;
		$row = $this->fetchRow('id = ' . $id);
		if (!$row) {
			throw new Zend_Db_Table_Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function updateMovimentacaoxxx($post)
	{
		$data = array(
//			'id'=> $post['id'],
			'cod'=> utf8_encode($post['cod']),
			'dsc'=> utf8_encode($post['dsc'])
		);
		$where = 'id = '.(int)$post['id'];
		$this->update($data , $where );
	}

	public function addMovimentacaoxxx($cod, $dsc)
	{

		if ($this->checkCodMovimentacao($cod)) {
			$data = array(
				'cod' => utf8_encode($cod),
				'dsc' => utf8_encode($dsc)
			);
			$result = $this->insert($data);
			return true;
		} else {
			return false;
		}

	}

	public function deleteMovimentacaoxxx($id)
	{
		$this->delete('id = ' . (int)$id);
	}

	/**
	 * Check if cod exists
	 * 
	 * @param string $cod
	 * @return boolean
	 */
	private function checkCodMovimentacaoxxx($cod)
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
