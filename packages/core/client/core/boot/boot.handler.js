import ns from 'core/namespace/ns.js';

ns.namespace('Core.Boot');

/**
 * @class Handler
 * @namespace Core.Boot
 * @module Core
 * @submodule Core.Boot
 *
 * @requires Core.Namespace.Ns
 */
class Handler{

	/**
	 * @method contructor
	 * @constructor
	 * @param {Core.Namespace.Ns} namespace
	 */
	constructor(namespace) {
		
		/**
		 * @property _ns
		 * @private
		 * @type {Core.Namespace.Ns}
		 * @default namespace
		 */
		this._ns = namespace; 
		

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
	 * [setVendor -> init setting -> init class binding -> init handler -> init route -> init react component].
	 *
	 * @method run
	 * @param {Object} [config={}]
	 */
	run(config = {}) {
		this._config = config;

		this._setVendor();
		this._initSetting();
		this._initBind();
		this._initHandler();
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
			this._config.initSetting(this._ns, this._config.setting);
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
			this._config.initBindCore(this._ns, this._config.bind);
		}

		if (typeof(this._config.initBindApp) === 'function') {
			this._config.initBindApp(this._ns, this._config.bind);
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
			this._config.initRoute(this._ns, this._config.route);
		}
	}

	/**
	 * Additional initialization handler.
	 *
	 * @method _initHandler
	 * @private
	 */
	_initHandler() {
		if (typeof(this._config.initHandlerCore) === 'function') {
			this._config.initHandlerCore(this._ns, this._config.handler);
		}

		if (typeof(this._config.initHandlerApp) === 'function') {
			this._config.initHandlerApp(this._ns, this._config.handler);
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
				componentHandler();
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

ns.Core.Boot.Handler = Handler;

ns.oc.bind('$Boot', new Handler(ns));


