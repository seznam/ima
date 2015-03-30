import ns from 'core/namespace/ns.js';

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
	 * @param {Object} setting
	 */
	constructor(seo, dictionary, setting) {

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
		 * @property _setting
		 * @private
		 * @type {Object}
		 * @default setting
		 */
		this._setting = setting;

	}

	createRoute(name, pathExpression, controller) {
		return ns.oc.create('$Route', name, pathExpression, controller)
	}

	createController(controller, router) {
		var controllerInstantion = ns.oc.make(controller);
		var decoratorController = ns.oc.create('$DecoratorController', controllerInstantion,
				this._seo, router, this._dictionary, this._setting);

		return decoratorController;
	}
}

ns.Core.Router.Factory = Factory;