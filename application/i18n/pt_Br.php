<?php

// Traduзгo para o Portuguкs por Nivaldo Arruda - nivaldo@gmail.com
$portugues = array();
$portugues['isEmpty']= 'Este campo nгo pode ser vazio';
$portugues['stringEmpty'] = "'%value%' й uma string vazia";

// Email
$portugues['emailAddressInvalid'] = 'Nгo й um email vбlido no formato nome@servidor';

//hostname
$portugues['hostnameIpAddressNotAllowed']  = "'%value%' Parece ser um endereзo de IP, mas endereзos de IP nгo sгo permitidos";
$portugues['hostnameUnknownTld'] = "'%value%' parece ser um DNS, mas nгo foi possivel validar o TLD";
$portugues['hostnameDashCharacter'] = "'%value%' parece ser um DNS, mas contйm um 'dash' (-) em uma posiзгo invбlida";
$portugues['hostnameInvalidHostnameSchema'] = "'%value%' parece ser um DNS, mas nгo foi possнvel comparar com o schema para o TLD '%tld%'";
$portugues['hostnameUndecipherableTld'] = "'%value%' parece ser um DNS mas nгo foi possнvel extrair o TLD";
$portugues['hostnameInvalidHostname'] = "'%value% nгo й compatнvel com a estrutura DNS";
$portugues['hostnameInvalidLocalName'] = "'%value%' nгo parece ser uma rede local vбlida";
$portugues['hostnameLocalNameNotAllowed'] = "'%value%' parece ser o nome de uma rede local, mas nome de rede local nгo sгo permitido";

//identical

$portugues['notSame'] = "Comparaзгo nгo bate";
$portugues['missingToken'] = "Nгo foi fornecido parвmetros para teste";

//greater then
$portugues['notGreaterThan'] = "'%value%' nгo й maior que '%min%'";

//float
//$portugues['notFloat'] = "'%value%' nгo й do tipo float";
$portugues['notFloat'] = "'%value%' nгo й do tipo float (utilizar . para separacao decimal)";

//date
$portugues['dateNotYYYY-MM-DD'] = "'%value%' deve estar no formato aaaa-mm-dd";
$portugues['dateInvalid'] = "'%value%' nгo parece ser um data vбlida";
$portugues['dateFalseFormat'] = "'%value%' nгo combina com o formato informado";

//digits
$portugues['notDigits'] = "'%value%' nгo contйm apenas dнgitos";

//between
$portugues['notBetween'] = "'%value%' nгo estб entre '%min%' e '%max%', inclusive";
$portugues['notBetweenStrict'] = "'%value%' nгo estб estritamente entre '%min%' e '%max%'";

//alnum
$portugues['notAlnum'] = "'%value%' nгo possuн apenas letras e dнgitos";

//alpha
$portugues['notAlpha'] = "'%value%' nгo possuн apenas letras";

//in array
$portugues['notInArray'] = "'%value%' nгo foi encontrado na lista";

//int
$portugues['notInt'] = "'%value%' nгo parece ser um inteiro";

//ip
$portugues['notIpAddress'] = "'%value%' nгo parece ser um endereзo ip vбlido";

//lessthan
$portugues['notLessThan'] = "'%value%' nгo й menor que '%max%'";

//notempty
$portugues['isEmpty'] = "Campo vazio, mas um valor diferente de vazio й esperado";

//regex
$portugues['regexNotMatch'] = "'%value%' nгo foi validado na expressгo '%pattern%'";

//stringlength
$portugues['stringLengthTooShort'] = "'%value%' й menor que %min% (tamanho mнnimo desse campo)";
$portugues['stringLengthTooLong'] = "'%value%' й maior que  %max% (tamanho maximo desse campo)";

//$portugues[''] = "";

//db
$portugues['noRecordFound'] = "Nenhum registro contendo '%value%' foi encontrado";  
$portugues['recordFound'] = "Um registro contendo '%value%' foi encontrado";

?>