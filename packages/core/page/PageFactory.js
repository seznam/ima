import ns from 'ima/namespace';
import IMAError from 'ima/error/GenericError';

ns.namespace('ima.page');

/**
 * Factory for page.
 *
 * @class PageFactory
 * @namespace ima.page
 * @module ima
 * @submodule ima.page
 *
 * @requires ima.ObjectContainer
 */
export default class PageFactory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {ima.ObjectContainer} oc
	 */
	constructor(oc) {

		/**
		 * @property _oc
		 * @private
		 * @type {ima.ObjectContainer}
		 */
		this._oc = oc;
	}

	/**
	 * Create new instance of ima.controller.Controller.
	 *
	 * @method createController
	 * @param {string} controller
	 * @return {ima.controller.Controller}
	 */
	createController(controller) {
		var controllerInstantion = this._oc.create(controller);

		return controllerInstantion;
	}

	/**
	 * Create instance of view.
	 *
	 * @method createView
	 * @param {string|React.Component} view
	 * @return {React.Component}
	 */
	createView(view) {
		if (typeof view === 'function') {
			return view;
		}
		var classConstructor = this._oc.getConstructorOf(view);

		if (classConstructor) {
			return classConstructor;
		} else {
			throw new IMAError(`ima.page.Factory:createView hasn't name ` +
					`of view "${view}".`);
		}
	}

	/**
	 * Returns decorated controller for ease setting seo params in controller.
	 *
	 * @method decorateController
	 * @param {ima.controller.Controller} controller
	 * @return {ima.controller.Controller}
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
	 * @param {ima.page.state.PageStateManager} pageStateManager
	 * @param {Array<string>} allowedStateKeys
	 * @return {ima.page.state.PageStateManager}
	 */
	decoratePageStateManager(pageStateManager, allowedStateKeys) {
		var decoratedPageStateManager = this._oc.create(
				'$PageStateManagerDecorator',
				[pageStateManager, allowedStateKeys]
		);

		return decoratedPageStateManager;
	}
}

ns.ima.page.PageFactory = PageFactory;
