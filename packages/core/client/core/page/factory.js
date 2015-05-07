import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';
import CoreError from 'imajs/client/core/coreError.js';

ns.namespace('Core.Page');

/**
 * Factory for page.
 *
 * @class Factory
 * @namespace Core.Page
 * @module Core
 * @submodule Core.Page
 */
class Factory {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {}

	/**
	 * Create new instance of Core.Interface.Controller.
	 *
	 * @method createController
	 * @param {string} controller
	 * @return {Core.Interface.Controller}
	 */
	createController(controller) {
		var controllerInstantion = oc.make(controller);

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

		if (oc.has(view)) {
			var view = oc.get(view);

			if (typeof view === 'function') {
				return view();
			} else {
				return view;
			}
		} else {
			throw new CoreError(`Core.Page.Factory:createView hasn't name of view "${view}".`);
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
		var seo = oc.get('$Seo');
		var router = oc.get('$Router');
		var dictionary = oc.get('$Dictionary');
		var settings = oc.get('$Settings');

		var decoratedController = oc.create('$DecoratorController', controllerInstance,
			seo, router, dictionary, settings);

		return decoratedController;
	}
}

ns.Core.Page.Factory = Factory;