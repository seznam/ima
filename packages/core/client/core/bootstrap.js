import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';

ns.namespace('Core');

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
		 *
		 *
		 * @property _components
		 * @private
		 * @type {Array}
		 * @default []
		 */
		this._components = [];
		
		/**
		 * @property _config
		 * @private
		 * @type {Object}
		 * @default {}
		 */
		this._config = {}; 
		
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
		this._initRoutes();
		this._initComponents();
	}

	/**
	 * Set vendor.
	 *
	 * @method _setVendor
	 * @private
	 */
	_setVendor() {
		var vendor = this._config.vendor;
		var nsVendor = ns.namespace('Vendor');
		for (var [name, lib] of vendor) {
			nsVendor[name] = lib;
		}
	}

	/**
	 * Initialization app settings.
	 *
	 * @method _initSettings
	 * @private
	 */
	_initSettings() {
		if (typeof(this._config.initSettings) === 'function') {
			this._config.initSettings(ns, oc, this._config.settings);
		}
	}

	/**
	 * Initialization bind instantions.
	 *
	 * @method _initBind
	 * @private
	 */
	_initBind() {
		if (typeof(this._config.initBindCore) === 'function') {
			this._config.initBindCore(ns, oc, this._config.bind);
		}

		if (typeof(this._config.initBindApp) === 'function') {
			this._config.initBindApp(ns, oc, this._config.bind);
		}
	}

	/**
	 * Initialization routes.
	 *
	 * @method _initRoutes
	 * @private
	 */
	_initRoutes() {
		if (typeof(this._config.initRoutes) === 'function') {
			this._config.initRoutes(ns, oc, this._config.routes);
		}
	}

	/**
	 * Additional initialization service.
	 *
	 * @method _initServices
	 * @private
	 */
	_initServices() {
		if (typeof(this._config.initServicesCore) === 'function') {
			this._config.initServicesCore(ns, oc, this._config.services);
		}

		if (typeof(this._config.initServicesApp) === 'function') {
			this._config.initServicesApp(ns, oc, this._config.services);
		}
	}

	/**
	 * Initialization components.
	 *
	 * @method _initComponents
	 * @private
	 */
	_initComponents() {
		for (var component of this._components) {
			if (typeof(component) === 'function') {
				component(oc.get('$Utils'));
			}
		}
	}

	/**
	 * Add component to pipe.
	 *
	 * @method addComponent
	 * @param {Function} component - function for init react component
	 */
	addComponent(component) {
		this._components.push(component);
	}
}

ns.Core.Bootstrap = Bootstrap;

var bootstrap = new Bootstrap();

export default bootstrap;