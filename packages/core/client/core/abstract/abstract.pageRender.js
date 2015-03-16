import ns from 'core/namespace/ns.js';

ns.namespace('Core.Abstract');

/**
 * Abstract class for Renderer.
 * @class PageRender
 * @extends Core.Interface.PageRender
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 *
 * @requires Vendor.Rsvp
 * @requires Vendor.React
 * @requires Core.Interface.Animate
 */
class PageRender extends ns.Core.Interface.PageRender{

	/**
	 * @constructor
	 * @method constructor
	 * @param {Vendor.Rsvp} rsvp
	 * @param {Vendor.React} react
	 * @param {Core.Interface.Animate} animate
	 * @param {Object} setting
	 */
	constructor(rsvp, react, animate, setting) {
		super();

		/**
		 * @property _rsvp
		 * @protected
		 * @type {Vendor.Rsvp}
		 * @default rsvp
		 * */
		this._rsvp = rsvp;

		/**
		 * @property react
		 * @protected
		 * @type {Vendor.React}
		 * @default react
		 * */
		this._react = react;

		/**
		 * @property _animate
		 * @protected
		 * @type {Core.Interface.Animate}
		 * @default animate
		 * */
		this._animate = animate;

		/**
		 * @property _setting
		 * @protected
		 * @type {Object}
		 * @default setting
		 * */
		this._setting = setting;

	}

	/**
	 * Method initialization controller with params.
	 *
	 * @method render
	 * @param {Core.Abstract.Controller} [controller=null]
	 * @param {Object} [params=null] - params for controller
	 */
	render(controller = null, params = {}) { // jshint ignore:line
		if (!controller) {
			throw new Error(`Core.Abstract.PageRender:render has undefined param 'controller'.`);
		}
		controller.init(params);
	}
}
ns.Core.Abstract.PageRender = PageRender;