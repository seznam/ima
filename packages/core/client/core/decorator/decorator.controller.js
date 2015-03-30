import ns from 'core/namespace/ns.js';

ns.namespace('Core.Decorator');

/**
 * Decorator for controller add seo.
 *
 * @class Controller
 * @extends Core.Interface.Controller
 * @namespace Core.Decorator
 * @module Core
 * @submodule Core.Decorator
 */
class Controller extends ns.Core.Interface.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Controller} controller
	 * @param {Core.Interface.Seo} seo
	 * @param {Core.Interface.Router} router
	 * @param {Core.Interface.Dictionary} dictionary
	 * @param {Object} setting
	 */
	constructor(controller, seo, router, dictionary, setting) {
		super();

		/**
		 * @property _controller
		 * @private
		 * @type {Core.Interface.Controller}
		 * @default controller
		 */
		this._controller = controller;

		/**
		 * @property _seo
		 * @private
		 * @type {Core.Interface.Seo}
		 * @default seo
		 */
		this._seo = seo;

		/**
		 * @property _router
		 * @private
		 * @type {Core.Interface.Router}
		 * @default router
		 */
		this._router = router;

		/**
		 * @property _dictionary
		 * @private
		 * @type {Core.Interface.Dictionary}
		 * @default dictionary
		 */
		this._dictionary = dictionary;

		/**
		 * @property _setting
		 * @private
		 * @type {Object}
		 * @default setting
		 */
		this._setting = setting;
	}

	/**
	 * Controller initialization.
	 *
	 * @method init
	 * @param {Object} [params={}] - controller options.
	 */
	init(params = {}) {
		this._controller.init(params);
	}

	/**
	 * Controller deinitialization.
	 *
	 * @method deinit
	 */
	deinit() {
		this._controller.deinit();
	}

	/**
	 * Controller will be activated on resolved promises. In this method you may use setInterval and setTimeout.
	 *
	 * @method activate
	 */
	activate() { // jshint ignore:line
		this._controller.activate();
	}

	/**
	 * Load data for controller.
	 *
	 * @method load
	 */
	load() {
		return this._controller.load();
	}

	/**
	 * Return reactive view.
	 *
	 * @method getReactView
	 * @return {Core.Abstract.View} - assigned view
	 */
	getReactView() {
		return this._controller.getReactView();
	}

	/**
	 * Set reactive view.
	 *
	 * @method setReactiveView
	 * @param {Vendor.ReactComponent} reactiveView
	 */
	setReactiveView(reactiveView) {
		this._controller.setReactiveView(reactiveView);
	}

	/**
	 * Set state to controller and to assigned reactive view (if exists).
	 *
	 * @method setState
	 * @param {Object} state
	 */
	setState(state) {
		this._controller.setState(state);
	}

	/**
	 * Add state to controller and to assigned reactive view (if exists).
	 *
	 * @method addState
	 * @param {Object} state
	 */
	addState(state) {
		this._controller.addState(state);
	}

	/**
	 * Returns state.
	 *
	 * @method getState
	 * @return {Object} - assigned view
	 */
	getState() {
		return this._controller.getState();
	}

	/**
	 * Set SEO params is called from resolved promises for active controller.
	 *
	 * @method setSeoParams
	 * @param {Object} resolvedPromises
	 */
	setSeoParams(resolvedPromises) { // jshint ignore:line
		this._controller.setSeoParams(resolvedPromises, this._seo, this._router, this._dictionary, this._setting);
	}

	/**
	 * Returns SEO params.
	 *
	 * @method getSeoHandler
	 * @return {Core.Interface.Seo}
	 */
	getSeoHandler() {
		return this._seo;
	}

	/**
	 * Returns http status.
	 *
	 * @method getHttpStatus
	 * @return {Number} - HTTP status number
	 */
	getHttpStatus() {
		return this._controller.getHttpStatus();
	}
}

ns.Core.Decorator.Controller = Controller;