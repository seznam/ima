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
	 * @param {Core.Namespace} namespace
	 * @param {Core.ObjectContainer} objectContainer
	 */
	constructor(namespace, objectContainer) {
		
		/**
		 * @property _ns
		 * @private
		 * @type {Core.Namespace}
		 * @default namespace
		 */
		this._ns = namespace; 

		/**
		 * @property _oc
		 * @private
		 * @type {Core.ObjectContainer}
		 * @default objectContainer
		 */
		this._oc = objectContainer;

		/**
		 *
		 *
		 * @property _component
		 * @private
		 * @type {Array}
		 * @default []
		 */
		this._component = []; 
		
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
		this._initSetting();
		this._initBind();
		this._initService();
		this._initRoute();
		this._initComponent();
	}

	/**
	 * Set vendor.
	 *
	 * @method _setVendor
	 * @private
	 */
	_setVendor() {
		var vendor = this._config.vendor;
		var nsVendor = this._ns.namespace('Vendor');
		for (var [name, lib] of vendor) {
			nsVendor[name] = lib;
		}
	}

	/**
	 * Initialization app settings.
	 *
	 * @method _initSetting
	 * @private
	 */
	_initSetting() {
		if (typeof(this._config.initSetting) === 'function') {
			this._config.initSetting(this._ns, this._oc, this._config.setting);
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
			this._config.initBindCore(this._ns, this._oc, this._config.bind);
		}

		if (typeof(this._config.initBindApp) === 'function') {
			this._config.initBindApp(this._ns, this._oc, this._config.bind);
		}
	}

	/**
	 * Initialization routes.
	 *
	 * @method _initRoute
	 * @private
	 */
	_initRoute() {
		if (typeof(this._config.initRoute) === 'function') {
			this._config.initRoute(this._ns, this._oc, this._config.route);
		}
	}

	/**
	 * Additional initialization service.
	 *
	 * @method _initService
	 * @private
	 */
	_initService() {
		if (typeof(this._config.initServiceCore) === 'function') {
			this._config.initServiceCore(this._ns, this._oc, this._config.service);
		}

		if (typeof(this._config.initServiceApp) === 'function') {
			this._config.initServiceApp(this._ns, this._oc, this._config.service);
		}
	}

	/**
	 * Initialization components.
	 *
	 * @method _initComponent
	 * @private
	 */
	_initComponent() {
		for (var componentHandler of this._component) {
			if (typeof(componentHandler) === 'function') {
				componentHandler(this._oc.get('$Utils'));
			}
		}
	}

	/**
	 * Add component to pipe.
	 *
	 * @method addComponent
	 * @param {Function} componentHandler - function for init react component
	 */
	addComponent(componentHandler) {
		this._component.push(componentHandler);
	}
}

ns.Core.Bootstrap = Bootstrap;

var bootstrap = new Bootstrap(ns, oc);

export default bootstrap;