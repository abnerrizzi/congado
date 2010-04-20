<pre>
<?

/*
ip 192.163.2.44
gw 192.163.1.11

proxy 192.163.2.8:1082
 */
$link = mysql_connect('127.0.0.1', 'root', '') or die(mysql_error());
$file = 'scripts/cobertur.csv';
$handle = fopen ($file, 'r');
$z=0;

$inline = 0;

if ($inline) {
	print "insert into `congado-dev`.`cobertura` values ";
}
while (!feof($handle))
{

	$atual = fgetcsv($handle, 10240, ';', "'");

	if ($inline) {
		print " (NULL, ";
	} else {
		print "insert into `congado-dev`.`cobertura` values (NULL, ";
	}
	$cols = count($atual);
	for ($i=0; $i < $cols; $i++)
	{
		// dt_nascimento
		if ($i == 2 || $i == 4) {
			$dt = converte_data($atual[$i]);
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
				} else {
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
				} else {
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
				$result = mysql_query($query);
				$row = mysql_fetch_row($result);
				print $row[0] . ', ';
				unset($row);
				continue;
			}
		} elseif ($i == 13) {
			$dt13 = converte_data($atual[$i]);
			if ($dt13 != "") {
				print "'" . $dt13 . "', ";
			} else {
				print "NULL, ";
			}
			continue;
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
		/*
		// criador_id
		if ($i == 7) {
			if ($atual[$i] != "") {
				$query = "SELECT id FROM congado.criador WHERE cod = '".$atual[$i]."'";
				$result = mysql_query($query);
				$row = mysql_fetch_row($result);
				print $row[0] . ', ';
				continue;
			}
		}
		// pelagem_id
		if ($i == 8) {
			if ($atual[$i] != "") {
				$query = "SELECT id FROM congado.pelagem WHERE cod = '".$atual[$i]."'";
				$result = mysql_query($query);
				$row = mysql_fetch_row($result);
				print $row[0] . ', ';
				continue;
			}
		}
		
		// raca_id
		if ($i == 9) {
			if ($atual[$i] != "") {
				$query = "SELECT id FROM congado.raca WHERE cod = '".$atual[$i]."'";
				$result = mysql_query($query);
				$row = mysql_fetch_row($result);
				print $row[0] . ', ';
				continue;
			}
		}
		// rebanho_id
		if ($i == 10) {
			if ($atual[$i] != "") {
				$query = "SELECT id FROM congado.rebanho WHERE cod = '".$atual[$i]."'";
				$result = mysql_query($query);
				$row = mysql_fetch_row($result);
				print $row[0] . ', ';
				continue;
			}
		}
		// categoria_id
		if ($i == 11) {
			if ($atual[$i] != "") {
				$query = "SELECT id FROM congado.categoria WHERE cod = '".$atual[$i]."'";
				$result = mysql_query($query);
				$row = mysql_fetch_row($result);
				print $row[0] . ', ';
				continue;
			}
		}
		// local_id
		if ($i == 12) {
			if ($atual[$i] != "") {
				$query = "SELECT id FROM congado.local WHERE local = '".$atual[$i]."' and fazenda_id = $atual[1]";
				$result = mysql_query($query);
				
				$row = mysql_fetch_row($result);
				if (!$row) {
					print 'NULL, ';
					continue;
				}
				print $row[0] . ', ';
				continue;
			}
		}
		// grausangue_id
		if ($i == 13) {
			if ($atual[$i] != "") {
				$query = "SELECT id FROM congado.grausangue WHERE cod = '".$atual[$i]."'";
				$result = mysql_query($query);
				$row = mysql_fetch_row($result);
				print $row[0] . ', ';
				continue;
			}
		}
		*/




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
//	if ($z == 5521) {
//		die();
//	}
	continue;
	
}
fclose($handle);





function converte_data($date) {
	if ($date != "") {
		return substr($date, 6) ."-". substr($date, 3, 2) ."-". substr($date, 0, 2);
	} else {
		return NULL;
	}
}

?>

