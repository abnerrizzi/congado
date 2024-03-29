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

		if ($orderby == 'dt') {
			$orderby = 'data';
		}

		if (!is_array($cols)) {
			$cols = array($cols);
		}

		$cols = array(
			'id',
			'dt' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
		);
		$this->_select
			->setIntegrityCheck(false)
			->from($this->_name, $cols, $this->_schema)
			->joinLeft(array('t' => 'sanitario_tipo'), 'tipo_id = t.id', array(), $this->_schema)
			->joinLeft(array('f' => 'fichario'), 'fichario_id = f.id', array('nome', 'cod'), $this->_schema)
			->joinLeft(array('d' => 'doenca'), 'ocorrencia_id = d.id', array('doenca' => 'dsc'), $this->_schema)
		;

		if ($this->getTipo() == 0) {
			$this->_select->joinLeft(
				array('s' => 'morte'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 1) {
			$this->_select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 2) {
			$this->_select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} else {
			throw new Zend_Db_Table_Exception('Tipo de movimenta��o n�o definido: (' . $this->getTipo() . ')');
		}
		$this->_select->where("tipo_id = ?", $this->getTipo());

		if ($orderby != null && $order != null) {
			$this->_select->order($orderby .' '. $order);
		}

		return $this->_select;

	}

	public function listJsonDiagnostico($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false)
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
			if ($like == 'false' || $like == false) {
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

	public function getSanitario($id)
	{

		$id = (int)$id;

		$this->_select
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
			$this->_select->joinLeft(
				array('s' => 'morte'),
				'sequencia_id = s.id',
				array('sequencia_id'  => 's.id', 'sequencia_cod' => 's.cod', 'sequencia'  => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 1) {
			$this->_select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('sequencia_id'  => 's.id', 'sequencia_cod' => 's.cod', 'sequencia'  => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 2) {
			$this->_select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('sequencia_id'  => 's.id', 'sequencia_cod' => 's.cod', 'sequencia'  => 's.dsc'),
				$this->_schema
			);
		} else {
			throw new Zend_Db_Table_Exception('Tipo de movimenta��o n�o definido: (' . $this->getTipo() . ')');
		}
		$this->_select->where("tipo_id = ?", $this->getTipo());
		$this->_select->where("$this->_name.id = ?", $id);
		
		$row = $this->fetchRow($this->_select);
		if (!$row) {
			throw new Zend_Db_Table_Exception("Count not find row $id");
		}
		$array = $row->toArray();
		foreach ($array as $key => $val) {
			$return[$key] = utf8_decode($val);
		}
		return $return;
	}

	public function updateSanitario($values)
	{
		if ($this->getTipo() != 0) {
			throw new Zend_Exception('Erro inesperado');
		}
		$_dt = explode('/', $values['data']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$data = array(
			'data' 			=> $_dt,
			'sequencia_id'	=> (int)$values['sequencia_id'],
			'comentario'	=> utf8_encode($values['comentario']),
			'tiposisbov'	=> strtoupper($values['tiposisbov']),
		);
		$where = $this->getAdapter()->quoteInto('id = ?', (int)$values['id']);
		
		$this->update($data, $where);
	}

	public function updateDoenca($values)
	{
		if ($this->getTipo() != 1) {
			throw new Zend_Exception('Erro inesperado');
		}
		$_dt = explode('/', $values['data']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$data = array(
			'data' 			=> $_dt,
			'sequencia_id'	=> (int)$values['sequencia_id'],
			'ocorrencia_id'	=> (int)$values['ocorrencia_id'],
			'comentario'	=> utf8_encode($values['comentario']),
			'tiposisbov'	=> strtoupper($values['tiposisbov']),
		);
		$where = $this->getAdapter()->quoteInto('id = ?', (int)$values['id']);
		
		$this->update($data, $where);
	}

	public function updateMorte($values)
	{

		$_dt = explode('/', $values['data']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$_dtp = explode('/', $values['dataproximo']);
		$_dtp = $_dtp[2] .'/'. $_dtp[1] .'/'. $_dtp[0];

		$data['data'] = $_dt;
		$data['ocorrencia_id'] = $values['ocorrencia_id'];
		$data['comentario'] = $values['comentario'];
		$data['dataproximo'] = $_dtp;

		$where = $this->getAdapter()->quoteInto('id = ?', (int)$values['id']);

	}

	public function addSanitarioDoenca($post)
	{
		if ($this->getTipo() != 1) {
			throw new Zend_Exception('Erro inesperado');
		}

		$_dt = explode('/', $post['data']);
		$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];

		$posts = array(
			'fichario_id'		=> $post['fichario_id'],
			'data'				=> $_dt,
			'ocorrencia_id'		=> $post['ocorrencia_id'],
			'sequencia_id'		=> $post['sequencia_id'],
			'comentario'		=> $post['comentario'],
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

	public function addSanitarioMorte($post)
	{
		if ($this->getTipo() != 0) {
			throw new Zend_Exception('Erro inesperado');
		}
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

	public function addSanitarioPreventivo($data, $ids)
	{

		if ($this->getTipo() != 2) {
			throw new Zend_Exception('Erro inesperado');
		}

		foreach ($ids as $key => $val) {

			$_dt = explode('/', $data['data']);
			$_dt = $_dt[2] .'/'. $_dt[1] .'/'. $_dt[0];
			

			$__current = $data;
			$__current['fichario_id'] = $key;
			$__current['data'] = $_dt;
			$__current['tipo_id'] = $this->getTipo();
			$row = $this->createRow($__current);
			if (!$row->save()) {
				return false;
			}
		}

		return true;

	}

	public function deleteMorte($id)
	{
		$this->delete('id = ' . (int)$id);
	}

	public function deleteDoenca($id)
	{
		$this->delete('id = ' . (int)$id);
	}

	public function listJsonPreventivo($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false, $params = array())
	{

		$col_id = $this->_name.'.id';
		$col_id = 'id';
		$this->_select
			->setIntegrityCheck(false)
			->from($this->_name, array(
				'id',
				'dt' => new Zend_Db_Expr("DATE_FORMAT(data, '%d/%m/%Y')"),
			), $this->_schema)
			->joinInner('fichario',$this->_name.'.fichario_id = fichario.id',array('fichario.nome'),$this->_schema)
//			->joinLeft(array('d' => 'doenca'), 'ocorrencia_id = d.id', array('doenca' => 'dsc'), $this->_schema)
//			->joinLeft(array('dst' => 'destino'), 'sequencia_id = dst.id', array('dst' => 'dsc'), $this->_schema)
			->where('tipo_id = ?', $this->getTipo())
		;

		if ($this->getTipo() == 0) {
			$this->_select->joinLeft(
				array('s' => 'morte'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 1) {
			$this->_select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} elseif ($this->getTipo() == 2) {
			$this->_select->joinLeft(
				array('s' => 'destino'),
				'sequencia_id = s.id',
				array('old' => 's.dsc'),
				$this->_schema
			);
		} else {
			throw new Zend_Db_Table_Exception('Tipo de movimenta��o n�o definido: (' . $this->getTipo() . ')');
		}

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

//		die('<pre>'.$this->_select);
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
					if ($val == null) {
						$current['cell'][] = '';
					} else {
						$current['cell'][] = ($val);
					}
				}
			}
			$return['rows'][] = $current;
		}
//		die('<pre>' . $this->_select);
		return $return;

	}

}
