import ns from 'ima/namespace';
import IMAError from 'ima/imaError';

ns.namespace('Ima.Page');

/**
 * Factory for page.
 *
 * @class Factory
 * @namespace Ima.Page
 * @module Ima
 * @submodule Ima.Page
 *
 * @requires Ima.ObjectContainer
 */
export default class Factory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Ima.ObjectContainer} oc
	 */
	constructor(oc) {

		/**
		 * @property _oc
		 * @private
		 * @type {Ima.ObjectContainer}
		 */
		this._oc = oc;
	}

	/**
	 * Create new instance of Ima.Controller.Controller.
	 *
	 * @method createController
	 * @param {string} controller
	 * @return {Ima.Controller.Controller}
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
			throw new IMAError(`Ima.Page.Factory:createView hasn't name ` +
					`of view "${view}".`);
		}
	}

	/**
	 * Returns decorated controller for ease setting seo params in controller.
	 *
	 * @method decorateController
	 * @param {Ima.Controller.Controller} controller
	 * @return {Ima.Controller.Controller}
	 */
	decorateController(controller) {
		var metaManager = this._oc.get('$MetaManager');
		var router = this._oc.get('$Router');
		var dictionary = this._oc.get('$Dictionary');
		var settings = this._oc.get('$Settings');

		var decoratedController = this._oc.create(
				'$ControllerDecorator',
				[controller, metaManager, router, dictionary, settings]
		);

		return decoratedController;
	}

	/**
	 * Returns decorated page state manager for extension.
	 *
	 * @method decoratePageStateManager
	 * @param {Ima.Interface.PageStateManager} pageStateManager
	 * @param {Array<string>} allowedStateKeys
	 * @return {Ima.Interface.PageStateManager}
	 */
	decoratePageStateManager(pageStateManager, allowedStateKeys) {
		var decoratedPageStateManager = this._oc.create(
				'$DecoratorPageStateManager',
				[pageStateManager, allowedStateKeys]
		);

		return decoratedPageStateManager;
	}
}

ns.Ima.Page.Factory = Factory;
