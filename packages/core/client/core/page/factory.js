import ns from 'imajs/client/core/namespace.js';
import IMAError from 'imajs/client/core/imaError.js';

ns.namespace('Core.Page');

/**
 * Factory for page.
 *
 * @class Factory
 * @namespace Core.Page
 * @module Core
 * @submodule Core.Page
 *
 * @requires Core.ObjectContainer
 */
class Factory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.ObjectContainer} oc
	 */
	constructor(oc) {

		/**
		 * @property _oc
		 * @private
		 * @type {Core.ObjectContainer}
		 */
		this._oc = oc;
	}

	/**
	 * Create new instance of Core.Interface.Controller.
	 *
	 * @method createController
	 * @param {string} controller
	 * @return {Core.Interface.Controller}
	 */
	createController(controller) {
		var controllerInstantion = this._oc.create(controller);

		return controllerInstantion;
	}

	/**
	 * Create instance of view.
	 *
	 * @method createView
	 * @param {string|Vendor.React.Component} view
	 * @return {Vendor.React.Component}
	 */
	createView(view) {
		if (typeof view === 'function') {
			return view;
		}
		var entry = this._oc.getEntry(view);

		if (entry) {
			return entry.classConstructor;
		} else {
			throw new IMAError(`Core.Page.Factory:createView hasn't name of view "${view}".`);
		}
	}

	/**
	 * Returns decorated controller for ease setting seo params in controller.
	 *
	 * @method decorateController
	 * @param {Core.Interface.Controller} controller
	 * @return {Core.Interface.Controller}
	 */
	decorateController(controllerInstance) {
		var seo = this._oc.get('$Seo');
		var router = this._oc.get('$Router');
		var dictionary = this._oc.get('$Dictionary');
		var settings = this._oc.get('$Settings');

		var decoratedController = this._oc.create('$DecoratorController', [controllerInstance,
			seo, router, dictionary, settings]);

		return decoratedController;
	}
}

ns.Core.Page.Factory = Factory;
