<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id: MorteController.php 492 2010-10-18 19:47:09Z bacteria_ $
 * 
 */

class Test_ImportController extends Zend_Controller_Action
{

	public function indexAction()
	{
		throw new Zend_Controller_Exception('Informe o controlador para a importacao');
	}

	public function coberturaAction()
	{

		print '<pre>';
		$__filename = APPLICATION_PATH . '/../scripts/cobertur.csv';
		$handle = @fopen($__filename, 'r');
		if (!$handle) {
			throw new Zend_Controller_Action_Exception('Erro abrindo arquivo: ' . APPLICATION_PATH . $__filename);
		}
		$link = mysql_connect('127.0.0.1', 'root', '') or die(mysql_error());
		$z=0;

		$inline = true;

		if ($inline) {
			print "insert into `congado-dev`.`cobertura` values\n";
		}

		while (!feof($handle))
		{
			$atual = fgetcsv($handle, 10240, ';', "'");
			if ($z == 0) {
				$z++;
				continue;
			}

			if ($inline) {
				print " (NULL, ";
			} else {
				print "insert into `congado-dev`.`cobertura` values (NULL, ";
			}

			$cols = count($atual);
			for ($i=0; $i < $cols; $i++)
			{
				if ($i == 2 || $i == 4) {
					$dt = $this->converte_data($atual[$i]);
					if ($i == 2) {
						$dt2 = $dt;
					} elseif ($i == 4) {
						$dt4 = $dt;
					}
					continue;
				} elseif ($i == 3) {
					if ($dt2 != NULL) {
						if ($atual[$i] != "") {
							$dt2 .= " " . substr($atual[$i], 0, strlen($atual[$i])-2) .":". substr($atual[$i], -2);
							print "'" . $dt2 . "', ";
							unset($dt2);
							continue;
						}
					} else {
						print "NULL, ";
						unset($dt2);
						continue;
					}
				} elseif ($i == 5) {
					if ($dt4 != NULL) {
						if ($atual[$i] != "") {
							$dt4 .= " " . substr($atual[$i], 0, (strlen($atual[$i])-2)) .":". substr($atual[$i], -2);
							print "'" . $dt4 . "', ";
							unset($dt4);
							continue;
						}
					} else {
						print "NULL, ";
						unset($dt4);
						continue;
					}
				} elseif ($i == 11) {
					if ($atual[$i] != "") {
						$query = "SELECT id FROM `congado-dev`.inseminador WHERE cod = '".$atual[$i]."'";
						$result = mysql_query($query) or die(mysql_error());
						$row = mysql_fetch_row($result);
						print $row[0] . ', ';
						unset($row);
						continue;
					}
				} elseif ($i == 17) {
					if ($atual[$i] != "") {
						$query = "SELECT id FROM `congado-dev`.lote WHERE cod = '".$atual[$i]."' and fazenda_id = '".$atual[0]."'";
						$result = mysql_query($query);
						$row = mysql_fetch_row($result);
						if (!$row[0]) {
							print "NULL";
						} else {
							print $row[0];
						}
						unset($row);
						continue;
					}
				}

				if ($atual[$i] == "") {
					$atual[$i] = "NULL";
				} elseif ($atual[$i] == "FALSO") {
					$atual[$i] = "FALSE";
				} elseif ($atual[$i] == "VERDADEIRO") {
					$atual[$i] = "TRUE";
				}
				if ($i < $cols-1) {
					if ($atual[$i] == "NULL" || $atual[$i] == "FALSE" || $atual[$i] == "TRUE") {
						print $atual[$i] . ", ";
					} else {
						print "'" . $atual[$i] . "', ";
					}
				} else {
					if ($atual[$i] == "NULL") {
						print $atual[$i];
					} else {
						print "'" . $atual[$i] . "'";
					}
				}

			}

			if ($inline) {
				print "),\n";
			} else {
				print ");\n";
			}

			$z++;
			if ($z == 16) {
				die();
			}
		}

		fclose($handle);
	}

	private function converte_data($date) {
		if ($date != "") {
			return substr($date, 6) ."-". substr($date, 3, 2) ."-". substr($date, 0, 2);
		} else {
			return NULL;
		}
	}
	
}
