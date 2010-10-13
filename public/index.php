<?php

/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
 */

/*
#coleta embrioes

deixar somente a primeira, retirar hora
dados gerais retirar



Cobertura ....
verificar se ja possui "gestacao positiva" ... com opcao de continuar ou nao!
-- mostrar o tipo da ultima cobertura


transferencia de embriao
retirar *tipo / *tecnica (dias de cio) / *ultimo cio
adicionar tipo ... tipo de transferencia (FIV/TE)


retirar do menu
acasalamento
 */

// Define path to application directory
defined('APPLICATION_PATH')
	|| define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
defined('APPLICATION_ENV')
	|| define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
	realpath(APPLICATION_PATH . '/../library'),
	get_include_path(),
)));

/** Zend_Application */
require_once 'Zend/Application.php';  

// Create application, bootstrap, and run
$application = new Zend_Application(
	APPLICATION_ENV, 
	APPLICATION_PATH . '/configs/application.ini'
);
$application->bootstrap()
			->run();