<?php

/**
 * @package Model
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Model
 * @subpackage Db
 * @version $Id: Alimento.php 105 2010-03-01 14:11:12Z bacteria_ $
 * 
 */
class Model_Db_Cobertura extends Model_Db
{

	protected $_name = 'cobertura';
	protected $_select = false;

	public function getPaginatorAdapter2($orderby = null, $order = null)
	{
		$this->_select = $this->select()
			->setIntegrityCheck(false)
			->from(array('c' => $this->_name), array(
				'id',
				'cod',
				'nome',
				'rgn',
				'dt_nascimento' => new Zend_Db_Expr("DATE_FORMAT(dt_nascimento, '%d/%m/%Y')"),
			), $this->_schema)
//			->joinLeft('raca', 'f.raca_id = raca.id', array('raca_dsc' => 'dsc'), $this->_schema)
			->joinLeft('local', 'f.local_id = local.id', array('local_dsc' => 'dsc'), $this->_schema)
//			faz o join recortando/delimitando a quantidade de caracteres
//			->joinLeft('fazenda', 'f.fazenda_id = fazenda.id', array('fazenda_dsc' => new Zend_Db_Expr("SUBSTRING(descricao, 1, 30)")), $this->_schema)
			->joinLeft('fazenda', 'f.fazenda_id = fazenda.id', array('fazenda_dsc' => 'descricao'), $this->_schema)
			->order($orderby .' '. $order)
			;

		return $this->_select;
		
	}
}