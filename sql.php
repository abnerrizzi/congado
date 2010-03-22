<?php $start = microtime(true);?>
<pre>
<?

$link = mysql_connect('localhost', 'root', '') or die(mysql_error());

$query = "select * from import.moviment_tipo order by id";
$result = mysql_query($query);

$tipo = array();
while ($row = mysql_fetch_assoc($result))
{
	$tipo[$row['id']] = strtoupper($row['dsc']);
}


$query = "select * from import.moviment limit 10";
$result = mysql_query($query);
while ($row = mysql_fetch_assoc($result))
{
	// desmama
	if ($row['tipo'] == 0) {
		print_r($row);

		// animal
		$_sql = "select * from congado.fichario where cod = $row[animal]";
		$_result = mysql_query($_sql);
		$_row = mysql_fetch_assoc($_result);
		print_r($_row['id']);
		print "\n";
		
		// old
		$_sql = "select id, cod from congado.categoria where cod = '$row[old]'";
		$_result = mysql_query($_sql);
		$_row = mysql_fetch_assoc($_result);
		print_r($_row['id']);
		print "\n";

		// new
		$_sql = "select id, cod from congado.categoria where cod = '$row[new]'";
		$_result = mysql_query($_sql);
		$_row = mysql_fetch_assoc($_result);
		print_r($_row['id']);
		print "\n";
		
		
		die();
	// categoria
	} elseif ($row['tipo'] == 1) {
	// local
	} elseif ($row['tipo'] == 4) {
	// lote
	} elseif ($row['tipo'] == 5) {
	// venda
	} elseif ($row['tipo'] == 6) {
	// fazenda
	} elseif ($row['tipo'] == 7) {
	// rebanho
	} elseif ($row['tipo'] == 8) {
//	} else {
//		die('tipo inesperado');
	}
	$_sql = "select id from congado.local where `local` = '$row[local]'";
	$_result = mysql_query($_sql) or die(mysql_error());
	$_row = mysql_fetch_assoc($_result);
	print_r($_row['id']);
	print "\n";
	
//	print_r($row);
}


mysql_close($link);

print number_format(microtime(true) - $start, 4) . " s";
?>

