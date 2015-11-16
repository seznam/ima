import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';

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
export default class Factory {

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
		var classConstructor = this._oc.getConstructorOf(view);

		if (classConstructor) {
			return classConstructor;
		} else {
			throw new IMAError(`Core.Page.Factory:createView hasn't name ` +
					`of view "${view}".`);
		}
	}

	/**
	 * Returns decorated controller for ease setting seo params in controller.
	 *
	 * @method decorateController
	 * @param {Core.Interface.Controller} controller
	 * @return {Core.Interface.Controller}
	 */
	decorateController(controller) {
		var metaManager = this._oc.get('$MetaManager');
		var router = this._oc.get('$Router');
		var dictionary = this._oc.get('$Dictionary');
		var settings = this._oc.get('$Settings');

		var decoratedController = this._oc.create(
				'$DecoratorController',
				[controller, metaManager, router, dictionary, settings]
		);

		return decoratedController;
	}

	/**
	 * Returns decorated page state manager for extension.
	 *
	 * @method decoratePageStateManager
	 * @param {Core.Interface.PageStateManager} pageStateManager
	 * @param {Array<string>} allowedStateKeys
	 * @return {Core.Interface.PageStateManager}
	 */
	decoratePageStateManager(pageStateManager, allowedStateKeys) {
		var decoratedPageStateManager = this._oc.create(
				'$DecoratorPageStateManager',
				[pageStateManager, allowedStateKeys]
		);

		return decoratedPageStateManager;
	}
}

ns.Core.Page.Factory = Factory;
