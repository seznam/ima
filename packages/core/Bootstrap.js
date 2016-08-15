import $Helper from 'ima-helpers';
import ns from './namespace';
import ObjectContainer from './ObjectContainer';

ns.namespace('ima');

/**
 * Environment name value in the production environment.
 *
 * @const
 * @property PRODUCTION_ENVIRONMENT
 * @type {string}
 */
const PRODUCTION_ENVIRONMENT = 'prod';

/**
 * Application bootstrap used to initialize the environment and the application
 * itself.
 *
 * @class Bootstrap
 * @namespace ima
 * @module ima
 *
 * @requires ima.Namespace
 */
export default class Bootstrap {

	/**
	 * Initializes the bootstrap.
	 *
	 * @constructor
	 * @method contructor
	 * @param {ObjectContainer} oc The application's object container to use
	 *        for managing dependencies.
	 */
	constructor(oc) {

		/**
		 * The object container used to manage dependencies.
		 *
		 * @private
		 * @property _oc
		 * @type {ObjectContainer}
		 */
		this._oc = oc;

		/**
		 * Application configuration.
		 *
		 * @private
		 * @property _config
		 * @type {Object<string, *>}
		 * @default {}
		 */
		this._config = {};
	}

	/**
	 * Initializes the application by running the bootstrap sequence. The
	 * sequence initializes the components of the application in the following
	 * order:
	 * - application settings
	 * - constants, service providers and class dependencies configuration
	 * - services
	 * - UI components
	 * - routing
	 *
	 * @method run
	 * @param {Object<string, *>} config The application environment
	 *        configuration for the current environment.
	 */
	run(config) {
		this._config = config;

		this._initSettings();
		this._bindDependencies();
		this._initServices();
		this._initRoutes();
	}

	/**
	 * Initializes the application settings. The method loads the settings for
	 * all environments and then pics the settings for the current environment.
	 *
	 * The method also handles using the values in the production environment
	 * as default values for configuration items in other environments.
	 *
	 * @private
	 * @method _initSettings
	 */
	_initSettings() {
		let currentApplicationSettings = {};

		let plugins = this._config.plugins.concat([this._config]);

		plugins
			.filter((plugin) => typeof plugin.initSettings === 'function')
			.forEach((plugin) => {
				let allPluginSettings = plugin.initSettings(
					ns,
					this._oc,
					this._config.settings
				);
				let environmentPluginSetting = this._getEnvironmentSetting(
					allPluginSettings
				);

				$Helper.assignRecursively(
					currentApplicationSettings,
					environmentPluginSetting
				);
			});

		this._config.bind = Object.assign(
			this._config.bind || {},
			currentApplicationSettings,
			this._config.settings
		);
	}

	/**
	 * Returns setting for current environment where base values are from production
	 * environment and other environments override base values.
	 *
	 * @private
	 * @method _getEnvironmentSetting
	 * @return {Object<string, *>}
	 */
	_getEnvironmentSetting(allSettings) {
		let environment = this._config.settings.$Env;
		let environmentSetting = allSettings[environment];

		if (environment !== PRODUCTION_ENVIRONMENT) {
			var	productionSettings = allSettings[PRODUCTION_ENVIRONMENT];
			$Helper.assignRecursively(
				productionSettings,
				environmentSetting
			);
			environmentSetting = productionSettings;
		}

		return environmentSetting;
	}

	/**
	 * Binds the constants, service providers and class dependencies to the
	 * object container.
	 *
	 * @private
	 * @method _bindDependencies
	 */
	_bindDependencies() {
		this._config.initBindIma(ns, this._oc, this._config.bind);
		this._oc.lock();

		this._config.plugins
			.filter((plugin) => typeof plugin.initBind === 'function')
			.forEach((plugin) => {
				plugin.initBind(ns, this._oc, this._config.bind);
			});

		this._oc.unlock();
		this._config.initBindApp(ns, this._oc, this._config.bind);
	}

	/**
	 * Initalizes the routes.
	 *
	 * @private
	 * @method _initRoutes
	 */
	_initRoutes() {
		this._config.initRoutes(ns, this._oc, this._config.routes);
	}

	/**
	 * Initializes the basic application services.
	 *
	 * @private
	 * @method _initServices
	 */
	_initServices() {
		this._config.initServicesIma(ns, this._oc, this._config.services);

		this._config.plugins
			.filter((plugin) => typeof plugin.initServices === 'function')
			.forEach((plugin) => {
				plugin.initServices(ns, this._oc, this._config.services);
			});

		this._config.initServicesApp(ns, this._oc, this._config.services);
	}
}

ns.ima.Bootstrap = Bootstrap;
