<pre>
<?
$file = 'scripts/simple_congado.csv';
$handle = fopen ($file, 'r');
$z=0;

while (!feof($handle))
{

	$line = str_replace(PHP_EOL, "", fgets($handle));
	print "insert into `import`.`fichario` values (";
	$row = explode('|', $line);
	$cols = count($row);
	for ($i=0; $i < $cols; $i++)
	{
		$col = $row[$i];
		if ($col === '') {
			print 'null';
		} elseif ($col === "FALSO") {
			print 'false';
		} elseif ($col === "VERDADEIRO") {
			print 'true';
		} elseif ($i === 6) {
			print "'" . substr($col, 6, 9) . '-' . substr($col, 3, 2) . '-' . substr($col, 0, 2) . "'";
		} else {
			print $row[$i];
		}
		if ($i != ($cols-1)) {
			print ', ';
		}

	}
	print ");\n";
	$z++;
}
fclose($handle);

?>
