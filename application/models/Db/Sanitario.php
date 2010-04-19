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

		foreach ($cols as $key => $val) {
			if ($val == 'data') {
				$cols[$val] = "DATE_FORMAT($val, '%d/%m/%Y')";
			} else {
				$cols[$key] = $val;
			}
		}

		$select = $this->select()
			->setIntegrityCheck(false)
			->from($this->_name, $cols, $this->_schema)
			->joinLeft(array('t' => 'sanitario_tipo'), 'tipo_id = t.id', array(), $this->_schema)
			->joinLeft(array('f' => 'fichario'), 'fichario_id = f.id', array('nome'), $this->_schema)
			->joinLeft(array('d' => 'doenca'), 'ocorrencia = d.id', array('doenca' => 'dsc'), $this->_schema)
		;

		if ($this->getTipo() == 0) {
			$select->joinLeft(
				array('s' => 'morte'),
				'sequencia = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 1) {
			$select->joinLeft(
				array('s' => 'destino'),
				'sequencia = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 2) {
			$select->joinLeft(
				array('s' => 'destino'),
				'sequencia = s.id',
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

//		die('<pre>'.$select);
		return $select;

	}

}