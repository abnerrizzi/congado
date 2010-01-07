<?php

/**
 * 
 * @author abner
 *
 * @version: $Id$
 * 
 */

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{

	public static $registry			= null;
	public static $root				= '';
	public static $frontController	= null;

	protected function _initAutoLoad()
	{
		$moduleLoader = new Zend_Application_Module_Autoloader(array(
			'namespace' => '',
			'basePath'	=> APPLICATION_PATH,
		));
		return $moduleLoader;
	}

	protected function _initEnviroment()
	{
		self::$root = dirname(dirname(__FILE__));
	}

	protected function _initRegistry()
	{
		self::$registry = new Zend_Registry(array(), ArrayObject::ARRAY_AS_PROPS);
		Zend_Registry::setInstance(self::$registry);
	}

	protected function _initConfiguration()
	{
		$config = new Zend_Config_Ini(
			self::$root . '/application/configs/application.ini',
			'production'
		);
		self::$registry->configuration = $config;
	}

	protected function _initView()
	{
		// Initialize view
		$view = new Zend_View();

		$view->doctype('XHTML1_TRANSITIONAL');
		$view->headTitle('SCBE')
			->setSeparator(' :: ');
		
		$view->setEncoding(self::$registry->configuration->resources->view->encoding);
		$view->strictVars(self::$registry->configuration->resources->view->strictVars);
		$view->setEscape(self::$registry->configuration->resources->view->escape);

		// Add it to the ViewRenderer
		$viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper(
			'ViewRenderer'
		);
		$viewRenderer->setView($view);

		// Return it, so that it can be stored by the bootstrap
	}

	protected function _initDatabase()
	{
		$config = self::$registry->configuration->resources;
		$db = Zend_Db::factory(
			$config->db->adapter,
			$config->db->params->toArray()
		);
		$db->query("SET NAMES 'utf8'");
		$db->query("SET CHARSET 'utf8'");
		self::$registry->database = $db;
		Zend_Db_Table::setDefaultAdapter($db);
	}

	protected function _initLayouts()
	{

		Zend_Layout::startMvc();
		$this->getPluginResource('frontcontroller')
			->getFrontController()
			->registerPlugin(new Plugin_ModuleLayout());

	}

	protected function _initDbprofile()
	{
		if ($this->getEnvironment() == 'development') {
			$profiler = new Zend_Db_Profiler_Firebug('MySQL Queries');
			$db = $this->getPluginResource('db');
			$db = $db->getDbAdapter();
			$profiler->setEnabled(true);
			$db->setProfiler($profiler);
		}
	}

	protected function _initControllers()
	{
		$front = Zend_Controller_Front::getInstance();
		$front->registerPlugin(new Plugin_Auth());
		$front->addModuleDirectory(APPLICATION_PATH . '/modules/admin/', 'admin');
    }

    protected function _initTranslation()
    {

        $portugues = array();
        include ('i18n/pt_Br.php');
        $translate = new Zend_Translate('array', $portugues, 'pt_BR');
        Zend_Registry::set('Zend_Translate', $translate);

    }

    protected function _initSession()
    {
        /*
         * Set session timeout according application.ini
         */

    	$__timeout = (self::$registry->configuration->resources->session->timeout->inactive * 60);
    	$__remember = (self::$registry->configuration->resources->session->timeout->remember_me_seconds * 60);
        $authNamespace = new Zend_Session_Namespace('Zend_Auth');
        if ($authNamespace->rememberme == 1) {
        	$authNamespace->setExpirationSeconds($__remember);
        } else {
        	$authNamespace->setExpirationSeconds($__timeout);
        }
    }

    protected function _initTimeZone()
    {
    	date_default_timezone_set('America/Sao_Paulo');
    }

}
