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
	 * [setVendor -> init setting -> init class binding -> init variable -> init dictionary -> init route -> init react component].
	 *
	 * @method run
	 * @param {Object} [config={}]
	 */
	run(config = {}) {
		this._config = config;

		this._setVendor();
		this._initSetting();
		this._initBind();
		this._initVariable();
		this._initDictionary();
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
	 * Initialization dictionary.
	 *
	 * @method _initDictionary
	 * @private
	 */
	_initDictionary() {
		if (typeof(this._config.initDictionaryCore) === 'function') {
			this._config.initDictionaryCore(this._ns, this._config.dictionary);
		}

		if (typeof(this._config.initDictionaryApp) === 'function') {
			this._config.initDictionaryApp(this._ns, this._config.dictionary);
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
	 * Initialization variables.
	 *
	 * @method _initVariable
	 * @private
	 */
	_initVariable() {
		if (typeof(this._config.initVariableCore) === 'function') {
			this._config.initVariableCore(this._ns, this._config.variable);
		}

		if (typeof(this._config.initVariableApp) === 'function') {
			this._config.initVariableApp(this._ns, this._config.variable);
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


