<pre>
<?
$link = mysql_connect('localhost', 'root', '') or die(mysql_error());
$file = 'scripts/simple_congado.csv';
$handle = fopen ($file, 'r');
$z=0;

while (!feof($handle))
{

	$atual = fgetcsv($handle, 10240, '|', '@');

	print "insert into `import`.`fichario` values (";

	$cols = count($atual);
	for ($i=0; $i < $cols; $i++)
	{
		// dt_nascimento
		if ($i == 6) {
			$date = substr($atual[$i], 6) ."-". substr($atual[$i], 3, 2) ."-". substr($atual[$i], 0, 2);
			print "'" . $date . "', ";
			continue;
		}
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
	print ");\n";
	$z++;
//	if ($z == 650) {
//		die();
//	}
	continue;
	
}
fclose($handle);

?>

