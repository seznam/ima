import ns from '../namespace';
import GenericError from '../error/GenericError';
import Controller from './Controller';
import Extension from '../extension/Extension';
import PageStateManager from '../page/state/PageStateManager';

ns.namespace('ima.controller');

/**
 * Basic implementation of the {@codelink Controller} interface, providing the
 * default implementation of the most of the API.
 *
 * @abstract
 * @class AbstractController
 * @implements Controller
 * @namespace ima.controller
 * @module ima
 * @submodule ima.controller
 */
export default class AbstractController extends Controller {

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
		 * @type {PageStateManager}
		 * @default null
		 */
		this._pageStateManager = null;

		/**
		 * The controller's extensions.
		 *
		 * @private
		 * @property _extensions
		 * @type {Array<string, Extension>}
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
		 * The route parameters extracted from the current route. This field is
		 * set externally by IMA right before the {@linkcode init()} or the
		 * {@linkcode update()} method is called.
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
		throw new GenericError('The ima.controller.AbstractController.load ' +
				'method is abstract and must be overridden');
	}

	/**
	 * @inheritdoc
	 * @method update
	 */
	update(params = {}) {
		return {};
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
		throw new GenericError(
			'The ima.controller.AbstractController.setMetaParams method is ' +
			'abstract and must be overridden'
		);
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

ns.ima.controller.AbstractController = AbstractController;
