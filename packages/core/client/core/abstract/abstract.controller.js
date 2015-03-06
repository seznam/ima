import ns from 'core/namespace/ns.js';

ns.namespace('Core.Abstract');

/**
 * Abstract class for controller.
 *
 * @class Controller
 * @extends Core.Interface.Controller
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 *
 * @requires Core.Abstract.View
 */
class Controller extends ns.Core.Interface.Controller {

	/**
	 * @constructor
	 * @method constructor
	 * @param {Core.Abstract.View} view
	 */
	constructor(view) {
		super();

		/**
		 * @property state
		 * @private
		 * @type Object
		 * @default {}
		 */
		this._state = {};

		/**
		 * @property _seo
		 * @private
		 * @type {Map}
		 * @default new Map()
		 * */
		this._seo = new Map();

		/**
		 * Pointer for active react class in DOM.
		 *
		 * @property _reactiveView
		 * @private
		 * @type Vendor.ReactComponent
		 * @default null
		 */
		this._reactiveView = null;

		/**
		 * @property _status
		 * @private
		 * @type {Number}
		 * @default 200
		 * */
		this._status = 200;


		/**
		 * @property view
		 * @private
		 * @type Core.Abstract.View
		 */
		this._view = view
			.init(this)
			.getView();
	}

	/**
	 * Controller initialization.
	 *
	 * @method init
	 * @param {String} [params={}] - controller options.
	 */
	init(params = {}) {
		this.params = params;
	}
		
	/**
	 * Controller deinitialization.
	 *
	 * @method deinit
	 */
	deinit() {
		this._reactiveView = null;
	}
	
	/**
	 * Controller will be activated on resolved promises. In this method you may use setInterval and setTimeout.
	 *
	 * @method activate
	 */
	activate() { // jshint ignore:line

	}

	/**
	 * @method getView
	 * @return {Core.Abstract.View} - assigned view
	 */
	getView() {
		return this._view;
	}
		
	/**
	 * @method setReactiveView
	 * @param {Vendor.ReactComponent} reactiveView 
	 */
	setReactiveView(reactiveView) {
		this._reactiveView = reactiveView;
	}

	/**
	 * Set state to controller and to assigned reactive view (if exists).
	 *
	 * @method setState
	 * @param {Mixed} state
	 */
	setState(state) {
		this._state = state;
		if (this._reactiveView) {
			this._reactiveView.setState(this._state);
		}
	}

	/**
	 * Add state to controller and to assigned reactive view (if exists).
	 *
	 * @method addState
	 * @param {Mixed} state
	 */
	addState(state) {
		this.setState(Object.assign(this._state, state));
	}

	/**
	 * @method setState
	 * @return {Mixed} - assigned view
	 */
	getState() {
		return this._state;
	}

	/**
	 * Set SEO params is called from resolved promises for active controller.
	 *
	 * @method setSeoParams
	 * @param {Object} resolvedPromises
	 * */
	setSeoParams(resolvedPromises) { // jshint ignore:line

	}

	/**
	 * Return SEO params.
	 *
	 * @method getSeoParams
	 * @return {Object} - {title, description, atd.}
	 * */
	getSeoParams() {
		return this._seo;
	}
	
	/**
	 * @method getHttpStatus
	 * @return {Number} - HTTP status number 
	 */
	getHttpStatus() {
		return this._status;
	}
}

ns.Core.Abstract.Controller = Controller;