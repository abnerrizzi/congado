<?php

/**
 * @package Interface
 */

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Interface
 * @subpackage Db
 * @version $Id: Pelagem.php 457 2010-10-06 14:35:29Z bacteria_ $
 * 
 */
interface Model_Db_Interface_Pelagem
{

	public function getPelagens($orderby = null, $order = null);

	public function getById($id);

	public function listPelagens($cols = '*');

	public function update($post);

	public function add($cod, $dsc);

	public function delete($id);

	function checkCod($cod);

}
