import ns from 'ima/namespace';
import IMAError from 'ima/imaError';
import ControllerInterface from 'ima/controller/controller';

ns.namespace('Ima.Controller');

/**
 * Basic implementation of the {@codelink Ima.Controller.Interface} interface,
 * providing the default implementation of most of the API.
 *
 * @abstract
 * @class AbstractController
 * @implements Ima.Controller.Controller
 * @namespace Ima.Controller
 * @module Ima
 * @submodule Ima.Controller
 */
export default class AbstractController extends ControllerInterface {

	/**
	 * Initializes the controller.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super();

		/**
		 * State manager.
		 *
		 * @property _pageStateManager
		 * @protected
		 * @type {Ima.PageStateManager.Interface}
		 * @default null
		 */
		this._pageStateManager = null;

		/**
		 * Defined extensions for current controller.
		 *
		 * @private
		 * @property _extensions
		 * @type {Array<string, Ima.Extension.Interface>}
		 */
		this._extensions = [];

		/**
		 * The HTTP response code to send to the client.
		 *
		 * @property status
		 * @public
		 * @type {number}
		 * @default 200
		 */
		this.status = 200;

		/**
		 * The route parameters extracted from the current route.
		 *
		 * @property params
		 * @public
		 * @type {Object<string, string>}
		 * @default {}
		 */
		this.params = {};
	}

	/**
	 * @inheritdoc
	 * @method init
	 */
	init() {}

	/**
	 * @inheritdoc
	 * @method destroy
	 */
	destroy() {}

	/**
	 * @inheritdoc
	 * @method activate
	 */
	activate() {}

	/**
	 * @inheritdoc
	 * @method deactivate
	 */
	deactivate() {}

	/**
	 * @inheritdoc
	 * @abstract
	 * @method load
	 */
	load() {
		throw new IMAError('The Ima.Controller.AbstractController.load method is ' +
				'abstract and must be overridden');
	}

	/**
	 * @inheritdoc
	 * @method update
	 */
	update(params = {}) {
		return this.getState();
	}

	/**
	 * @inheritdoc
	 * @method setState
	 */
	setState(statePatch) {
		if (this._pageStateManager) {
			this._pageStateManager.setState(statePatch);
		}
	}

	/**
	 * @inheritdoc
	 * @method getState
	 */
	getState() {
		if (this._pageStateManager) {
			return this._pageStateManager.getState();
		} else {
			return {};
		}
	}

	/**
	 * @inheritdoc
	 * @method addExtension
	 */
	addExtension(extension) {
		this._extensions.push(extension);
	}

	/**
	 * @inheritdoc
	 * @method getExtensions
	 */
	getExtensions() {
		return this._extensions;
	}

	/**
	 * @inheritdoc
	 * @abstract
	 * @method setMetaParams
	 */
	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		throw new IMAError('The Ima.Controller.AbstractController.setMetaParams ' +
				'method is abstract and must be overridden');
	}

	/**
	 * @inheritdoc
	 * @method setRouteParams
	 */
	setRouteParams(params = {}) {
		this.params = params;
	}

	/**
	 * @inheritdoc
	 * @method getRouteParams
	 */
	getRouteParams() {
		return this.params;
	}

	/**
	 * @inheritdoc
	 * @method setPageStateManager
	 */
	setPageStateManager(pageStateManager) {
		this._pageStateManager = pageStateManager;
	}

	/**
	 * @inheritdoc
	 * @method getHttpStatus
	 */
	getHttpStatus() {
		return this.status;
	}
}

ns.Ima.Controller.AbstractController = AbstractController;
