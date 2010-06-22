<pre>
<?

/*
ip 192.163.2.44
gw 192.163.1.11

proxy 192.163.2.8:1082
 */
$link = mysql_connect('127.0.0.1', 'root', '') or die(mysql_error());
$file = 'scripts/coletaem.csv';
$handle = fopen ($file, 'r');
$z=0;

$table = 'coletaembriao';
$inline = 0;

if ($inline) {
	print "insert into `congado-dev`.`$table` values ";
}
while (!feof($handle))
{

	$atual = fgetcsv($handle, 10240, ';', '"');
	if ($atual[0] == 'fazenda_id') {
		$keys = $atual;
		continue;
	}

//	$temp = array_combine($keys, $atual);
//	print_r($temp);

	if ($inline) {
		print " ($z, ";
	} else {
		print "insert into `congado-dev`.`$table` values (NULL, ";
	}
	$cols = count($atual);
	for ($i=0; $i < $cols; $i++)
	{
		// campos de data
		$_datas = array(
			2, 5, 6
		);
		$_datas_hora = array(
			10,  13, 16, 22, 27, 32, 37
		);
		if (in_array($i, $_datas)) {
			$dt13 = converte_data($atual[$i]);
			if ($dt13 != "") {
				print "'" . $dt13 . "', ";
			} else {
				print "NULL, ";
			}
			continue;
		} elseif (in_array($i, $_datas_hora)) {
			$dt13 = converte_data($atual[$i]);
			if (strlen($atual[$i]) > 0) {
				if (strlen($atual[$i+1]) > 0) {
					if (strlen($atual[$i+1]) == 8) {
						$dt13 .= ' '.$atual[$i+1];
						print "'" . $dt13 . "', ";
					} else {
						var_dump($atual[$i+1]);
//						die('erro inesperado');
					}
				} else {
					$dt13 .= ' 00:00:00';
					print "'" . $dt13 . "', ";
				}
			} else {
				$dt13 .= ' 00:00:00';
				print "NULL, ";
			}
			$i++;
			continue;
		} elseif ($atual[$i] == "") {
			$atual[$i] = "NULL";
		} elseif ($atual[$i] == "FALSO") {
			$atual[$i] = "FALSE";
		} elseif ($atual[$i] == "VERDADEIRO") {
			$atual[$i] = "TRUE";
		}
		if ($i < $cols-1) {
			if ($atual[$i] == "NULL" || $atual[$i] == "FALSE" || $atual[$i] == "TRUE") {
				print $atual[$i] . ", ";
			} elseif (is_numeric($atual[$i])) {
				print $atual[$i] . ", ";
			} else {
				print "'" . $atual[$i] . "', ";
			}
		} else {
			if ($atual[$i] == "NULL") {
				print $atual[$i];
			} elseif ($atual[$i] == intval($atual[$i])) {
				print intval($atual[$i]);
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
//	if ($z == 3) {
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

