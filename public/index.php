<?php
/*
function AUTHAD($host, $domain, $user, $pass) {
    if ((strlen($user) >= 3) && (strlen($pass) >= 4)) {
        $conecta = ldap_connect($host);
		ldap_set_option($conecta, LDAP_OPT_PROTOCOL_VERSION, 3);
		ldap_set_option($conecta, LDAP_OPT_REFERRALS, 0);
        $bind 	 = ldap_bind($conecta, $user . "@" . $domain, $pass);
        if (!$conecta) {
            return false; //echo ldap_error($conecta);
        } elseif (!$bind) {
            return false; //echo ldap_error($conecta);
        } else {
            return true;
        }
    } else {
        return false;
    }
}
if (AUTHAD('192.163.1.200', 'HPTRANSPORTES', 'testej', 'teste')) {
	print 'LOGOU';
} else {
	print 'ERRO';
}
die();
*/
/**
 * 
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 *
 * @version $Id$
 * 
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