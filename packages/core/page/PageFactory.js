import ns from '../namespace';
import PageStateManager from './state/PageStateManager';
import ObjectContainer from '../ObjectContainer';
import Controller from '../controller/Controller';
import GenericError from '../error/GenericError';

ns.namespace('ima.page');

/**
 * Factory for page.
 *
 * @class PageFactory
 * @namespace ima.page
 * @module ima
 * @submodule ima.page
 *
 * @requires ObjectContainer
 */
export default class PageFactory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {ObjectContainer} oc
	 */
	constructor(oc) {

		/**
		 * @property _oc
		 * @private
		 * @type {ObjectContainer}
		 */
		this._oc = oc;
	}

	/**
	 * Create new instance of {@linkcode Controller}.
	 *
	 * @method createController
	 * @param {(string|function(new:Controller))} controller
	 * @return {Controller}
	 */
	createController(controller) {
		let controllerInstance = this._oc.create(controller);

		return controllerInstance;
	}

	/**
	 * Create instance of view.
	 *
	 * @method createView
	 * @param {(string|React.Component)} view
	 * @return {React.Component}
	 */
	createView(view) {
		if (typeof view === 'function') {
			return view;
		}
		let classConstructor = this._oc.getConstructorOf(view);

		if (classConstructor) {
			return classConstructor;
		} else {
			throw new GenericError(`ima.page.Factory:createView hasn't name ` +
					`of view "${view}".`);
		}
	}

	/**
	 * Returns decorated controller for ease setting seo params in controller.
	 *
	 * @method decorateController
	 * @param {Controller} controller
	 * @return {Controller}
	 */
	decorateController(controller) {
		let metaManager = this._oc.get('$MetaManager');
		let router = this._oc.get('$Router');
		let dictionary = this._oc.get('$Dictionary');
		let settings = this._oc.get('$Settings');

		let decoratedController = this._oc.create(
			'$ControllerDecorator',
			[controller, metaManager, router, dictionary, settings]
		);

		return decoratedController;
	}

	/**
	 * Returns decorated page state manager for extension.
	 *
	 * @method decoratePageStateManager
	 * @param {PageStateManager} pageStateManager
	 * @param {string[]} allowedStateKeys
	 * @return {PageStateManager}
	 */
	decoratePageStateManager(pageStateManager, allowedStateKeys) {
		let decoratedPageStateManager = this._oc.create(
			'$PageStateManagerDecorator',
			[pageStateManager, allowedStateKeys]
		);

		return decoratedPageStateManager;
	}
}

ns.ima.page.PageFactory = PageFactory;
