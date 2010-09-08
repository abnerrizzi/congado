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
class Model_Db extends Zend_Db_Table_Abstract
{

	public function init()
	{
		$db = Zend_Registry::get('database');
		$db = $db->getConfig();
		$this->_schema = $db['dbname'];
	}

	/**
	 * Função responsavel pela contagem e paginacao dos resultados
	 * 
	 * @param string $orderby fields order index
	 * @param string(ASC|DESC) $order order
	 * @param string|array $cols column names used in result
	 * @return Zend_Db_Table_Select
	 */
	public function getPaginatorAdapter($orderby = null, $order = null, $cols = '*')
	{

		if (!is_array($cols)) {
			$cols = array($cols);
		}

		$select = $this->select()
			->from($this->_name, $cols, $this->_schema);

		if ($orderby != null && $order != null) {
			$select->order($orderby .' '. $order);
		}

		return $select;

	}

	/**
	 * Retorna uma array no formato exigido pelo flexigrid
	 * 
	 * @param array|string $cols colunas a serem retornadas
	 * @param string $orderby nome da coluna a ser ordenada
	 * @param int $page numero da pagina atual
	 * @param int $limit numero de registros por pagina
	 * @param string $qtype nome do campo
	 * @param string $query valor a ser procurado
	 * @param boolean $order true or false for ASC or DESC
	 * @param boolean $like true of false to enable like '%%'
	 * @return array
	 */
	public function listJson($cols = '*', $orderby = false, $order = false, $page = false, $limit = false, $qtype = false, $query = false, $like = false)
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

}

/*
-- $Id$

-- @file
-- The SQL portion of the 'Natural Sort' module.
--
-- It is important to read the "How does this module work" section
-- of the README.txt for better understanding of this code.

-- ---------------------------------------------------------------------------
-- The algorithm(s)

DROP FUNCTION IF EXISTS natsort_canon;
delimiter //
CREATE FUNCTION natsort_canon(s varchar(255), algorithm varchar(20)) RETURNS VARCHAR(255)
  NO SQL
  DETERMINISTIC
BEGIN
  DECLARE orig   varchar(255)  default s;    -- the original string passed to us.
  DECLARE ret    varchar(255)  default '';   -- the string we're to return.

  IF s IS NULL THEN

    -- It is the custom in SQL to propagate NULL.
    RETURN NULL;

  ELSEIF NOT s REGEXP '[0-9]' THEN

    -- No numbers in this string, so skip the costly calculation.
    SET ret = s;

  ELSE

    -- Our task is to expand all numbers to have a fixed number of digits.
    -- 'I want 3.5 potatoes' -> 'I want [0000003500] potatoes'.

    -- We don't have regexp replacement function in MySQL, so our first step is to
    -- replace all numbers with '#'s. We later pull the actual values from 'orig'.

    SET s = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(s, '0', '#'), '1', '#'), '2', '#'), '3', '#'), '4', '#');
    SET s = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(s, '5', '#'), '6', '#'), '7', '#'), '8', '#'), '9', '#');
    SET s = REPLACE(s, '.#', '##');    -- a decimal point may proceed a number, but it never follows it.
    SET s = REPLACE(s, '#,#', '###');  -- numbers may contain thousands separator.
    -- and note that we don't have to worry about the '-' in front of a number, because
    -- its ord() is lower than that of digits.

    BEGIN

      DECLARE numpos int;
      DECLARE numlen int;
      DECLARE numstr varchar(255);

      lp1: LOOP

        -- find the next number
        SET numpos = LOCATE('#', s);

        -- no more numbers here
        IF numpos = 0 THEN
          SET ret = CONCAT(ret, s);
          LEAVE lp1;
        END IF;

        -- take everything till the number...
        IF algorithm = 'firstnumber' AND ret = '' THEN
          -- however,
          -- if it's the 'firstnumber' algorithm and no number was encountered yet,
          -- then do nothing.
          BEGIN END;
        ELSE
          SET ret = CONCAT(ret, SUBSTRING(s, 1, numpos - 1));
        END IF;
        -- ...and remove it from the input:
        SET s    = SUBSTRING(s,    numpos);
        SET orig = SUBSTRING(orig, numpos);

        -- calculate the length of this number, which is now at the start of the string.
        SET numlen = CHAR_LENGTH(s) - CHAR_LENGTH(TRIM(LEADING '#' FROM s));

        -- read this number...
        SET numstr = CAST(REPLACE(SUBSTRING(orig,1,numlen), ',', '') AS DECIMAL(13,3));
        -- ...pad it...
        SET numstr = LPAD(numstr, 15, '0');
        -- ...and append it to the string we're to return.
        SET ret = CONCAT(ret, '[', numstr, ']');

        -- we're finished with this number, so remove it from the input:
        SET s    = SUBSTRING(s,    numlen+1);
        SET orig = SUBSTRING(orig, numlen+1);

      END LOOP;

    END;

  END IF;

  -- I don't know how much this is needed, but let's remove all spaces
  -- and some punctuation marks.
  SET ret = REPLACE(REPLACE(REPLACE(REPLACE(ret, ' ', ''), ',', ''), ':', ''), '.', '');

  RETURN ret;
END;
//
delimiter ;

-- ---------------------------------------------------------------------------
-- Utilities

-- natsort_canon_save() is just like natsort_canon() except it saves the
-- calculation result for next time. See README.txt for info on how to use it.
DROP FUNCTION IF EXISTS natsort_canon_save;
delimiter //
CREATE FUNCTION natsort_canon_save(s VARCHAR(255), algorithm VARCHAR(20)) RETURNS VARCHAR(255)
  CONTAINS SQL
  DETERMINISTIC
BEGIN
  IF s IS NULL THEN
    RETURN NULL;
  ELSE
    SET @tmp_ := natsort_canon(s, algorithm);
    INSERT INTO natsort_lookup_pending VALUES (algorithm, s, @tmp_);
    RETURN @tmp_;
  END IF;
END;
//
delimiter ;

-- Type 'call natsort_benchmark();' at the prompt for time estimation.
DROP PROCEDURE IF EXISTS natsort_benchmark;
delimiter //
CREATE PROCEDURE natsort_benchmark()
BEGIN
  DECLARE i INT DEFAULT 0;
  WHILE i < 1000 DO
    CALL natsort_canon('some testing, 123 blah', 'natural');
    SET i = i + 1;
  END WHILE;
END;
//
delimiter ;

-- ---------------------------------------------------------------------------
-- Initializer and finalizer.
--
-- These are called by Drupal to initialize and stop the system.

DROP PROCEDURE IF EXISTS natsort_initialize;
delimiter //
CREATE PROCEDURE natsort_initialize()
BEGIN
  -- Nothing to do. In the future maybe we will create a 
  -- temporary HEAP table for 'natsort_lookup_pending' here.
END;
//
delimiter ;

-- The finalizer. Saves all calculations to next time.
DROP PROCEDURE IF EXISTS natsort_finalize;
delimiter //
CREATE PROCEDURE natsort_finalize()
  CONTAINS SQL
BEGIN
  -- Move all the pending rows to the normal table.
  INSERT IGNORE INTO natsort_lookup SELECT * FROM natsort_lookup_pending;
  TRUNCATE TABLE natsort_lookup_pending;
END;
//
delimiter ;

-- ---------------------------------------------------------------------------
-- Tables

-- A table to cache all calculated values.
DROP TABLE IF EXISTS natsort_lookup;
CREATE TABLE natsort_lookup (
  `algorithm` varchar(20)  NOT NULL default '',
  `source`    varchar(255) NOT NULL default '',
  `target`    varchar(255) NOT NULL default '',
  PRIMARY KEY (`algorithm`, `source`)
) DEFAULT CHARSET=utf8;

-- This 'natsort_lookup_pending' table temporarily hold calculated values.
-- It is flushed, when Drupal finishes, into the 'natsort_lookup' table, above.
-- TODO: should I meake this a temporary HEAP table, in natsort_initialize()?
DROP TABLE IF EXISTS natsort_lookup_pending;
CREATE TABLE natsort_lookup_pending (
  `algorithm` varchar(20)  NOT NULL default '',
  `source`    varchar(255) NOT NULL default '',
  `target`    varchar(255) NOT NULL default ''
  -- For MySQL we don't need a key for this table. It's simply dumped
  -- into the normal table with 'IGNORE'
) DEFAULT CHARSET=utf8;
 */