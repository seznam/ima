import ns from 'ima/namespace';
import $Helper from 'ima-helpers';

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
	 * Initializes the bootstrap
	 *
	 * @constructor
	 * @method contructor
	 * @param {ima.ObjectContainer} oc The application's object container to
	 *        use for managing dependencies.
	 */
	constructor(oc) {

		/**
		 * The object container used to manage dependencies.
		 *
		 * @private
		 * @property _oc
		 * @type {ima.ObjectContainer}
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
		this._initRouting();
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
		var allSettings = this._config.initSettings(
			ns,
			this._oc,
			this._config.settings
		);
		var environment = this._config.settings.$Env;
		var currentSettings = allSettings[environment];

		if (environment !== PRODUCTION_ENVIRONMENT) {
			var	productionSettings = allSettings[PRODUCTION_ENVIRONMENT];
			$Helper.assignRecursively(
				productionSettings,
				currentSettings
			);
			currentSettings = productionSettings;
		}

		this._config.bind = Object.assign(
			this._config.bind || {},
			currentSettings,
			this._config.settings
		);
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
		this._config.initBindApp(ns, this._oc, this._config.bind);
	}

	/**
	 * Initalizes the routing.
	 *
	 * @private
	 * @method _initRouting
	 */
	_initRouting() {
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
		this._config.initServicesApp(ns, this._oc, this._config.services);
	}
}

ns.ima.Bootstrap = Bootstrap;
