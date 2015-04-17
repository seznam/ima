import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';
import CoreError from 'imajs/client/core/coreError.js';

ns.namespace('Core.Router');

/**
 * Factory for router.
 *
 * @class Factory
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class Factory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Seo} seo
	 * @param {Core.Interface.Dictionary} dictionary
	 * @param {Core.Interface.PageState} pageState
	 * @param {Object} setting
	 */
	constructor(seo, dictionary, pageState, setting) {

		/**
		 * @property _seo
		 * @private
		 * @type {Core.Interface.Seo}
		 * @default seo
		 */
		this._seo = seo;

		/**
		 * @property _dictionary
		 * @private
		 * @type {Core.Interface.Dictionary}
		 * @default dictionary
		 */
		this._dictionary = dictionary;

		/**
		 * @property _pageState
		 * @type {Core.Interface.PageState}
		 * @default pageState
		 */
		this._pageState = pageState;

		/**
		 * @property _setting
		 * @private
		 * @type {Object}
		 * @default setting
		 */
		this._setting = setting;

	}

	/**
	 * Create new instance of Core.Router.Route.
	 *
	 * @method createRoute
	 * @param {string} name
	 * @param {string} pathExpression
	 * @param {string} controller
	 * @param {string} view
	 * @return {Core.Router.Route}
	 */
	createRoute(name, pathExpression, controller, view) {
		return oc.create('$Route', name, pathExpression, controller, view)
	}

	/**
	 * Create new instance of Core.Interface.Controller.
	 *
	 * @method createController
	 * @param {string} controller
	 * @param {Core.Interface.Router} router
	 * @return {Core.Interface.Controller}
	 */
	createController(controller, router) {
		var controllerInstantion = oc.make(controller);
		var stateDecoratorController = oc.create('$StateDecoratorController', controllerInstantion,
			this._pageState);
		var seoDecoratorController = oc.create('$SeoDecoratorController', stateDecoratorController,
				this._seo, router, this._dictionary, this._setting);

		return seoDecoratorController;
	}

	/**
	 * Create instance of view.
	 *
	 * @method createView
	 * @param {string} view
	 * @return {Vendor.React.Component}
	 */
	createView(view) {
		if (ns.has(view)) {
			return ns.namespace(view);
		} else {
			throw new CoreError(`Core.Router.Factory:createView has undefiend name of view "${view}".`);
		}
	}
}

ns.Core.Router.Factory = Factory;