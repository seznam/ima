import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';
import component from 'imajs/client/core/component.js';

ns.namespace('Core');

/**
 * @property PRODUCTION_ENVIRONMENT
 * @const
 * @type {string}
 * @default 'prod'
 */
const PRODUCTION_ENVIRONMENT = 'prod';


/**
 * @class Bootstrap
 * @namespace Core
 * @module Core
 *
 * @requires Core.Namespace
 */
class Bootstrap{

	/**
	 * @method contructor
	 * @constructor
	 */
	constructor() {
		
		/**
		 * @property _config
		 * @private
		 * @type {Object}
		 * @default {}
		 */
		this._config = {};

		/**
		 * @property _isInitialized
		 * @private
		 * @type {Boolean}
		 * @default false
		 */
		this._isInitialized = false;

	}

	/**
	 * Run boot sequence for app with config for each step:
	 * [setVendor -> init setting -> init class binding -> init service -> init route -> init react component].
	 *
	 * @method run
	 * @param {Object} [config={}]
	 */
	run(config = {}) {
		this._config = config;

		this._setVendor();
		this._initSettings();
		this._initBind();
		this._initServices();
		this._initComponents();
		this._initRoutes();

		this._isInitialized = true;
	}

	/**
	 * Set vendor.
	 *
	 * @method _setVendor
	 * @private
	 */
	_setVendor() {
		if (!this._isInitialized) {
			var vendor = this._config.vendor;
			var nsVendor = ns.namespace('Vendor');
			for (var [name, lib] of vendor) {
				nsVendor[name] = lib;
			}
		}
	}

	/**
	 * Initialization app settings.
	 *
	 * @method _initSettings
	 * @private
	 */
	_initSettings() {
		var allSettings = this._config.initSettings(ns, oc, this._config.settings);
		var environment = this._config.settings['$Env'];
		var currentSettings = allSettings[environment];

		if (environment !== PRODUCTION_ENVIRONMENT) {
			var	productionSettings = allSettings[PRODUCTION_ENVIRONMENT];
			ns.Vendor.$Helper.assignRecursively(productionSettings, currentSettings);
			currentSettings = productionSettings;
		}

		this._config.bind = Object.assign(this._config.bind || {}, currentSettings, this._config.settings);
	}

	/**
	 * Initialization bind instantions.
	 *
	 * @method _initBind
	 * @private
	 */
	_initBind() {
		this._config.initBindCore(ns, oc, this._config.bind);
		this._config.initBindApp(ns, oc, this._config.bind);
	}

	/**
	 * Initialization routes.
	 *
	 * @method _initRoutes
	 * @private
	 */
	_initRoutes() {
		this._config.initRoutes(ns, oc, this._config.routes);
	}

	/**
	 * Additional initialization service.
	 *
	 * @method _initServices
	 * @private
	 */
	_initServices() {
		this._config.initServicesCore(ns, oc, this._config.services);
		this._config.initServicesApp(ns, oc, this._config.services);
	}

	/**
	 * Initialization components.
	 *
	 * @method _initComponents
	 * @private
	 */
	_initComponents() {
		if (!this._isInitialized) {
			for (var componentFn of component.getComponents()) {
				if (typeof(componentFn) === 'function') {
					componentFn(oc.get('$Utils'));
				}
			}
		}
	}
}

ns.Core.Bootstrap = Bootstrap;