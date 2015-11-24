import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';

ns.namespace('Core.Abstract');

/**
 * Basic implementation of the {@codelink Core.Interface.Controller} interface,
 * providing the default implementation of most of the API.
 *
 * @abstract
 * @class Controller
 * @implements Core.Interface.Controller
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 * @requires Core.Interface.View
 */
export default class Controller extends ns.Core.Interface.Controller {

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
		 * @type {Core.Interface.PageStateManager}
		 * @default null
		 */
		this._pageStateManager = null;

		/**
		 * Defined extensions for current controller.
		 *
		 * @private
		 * @property _extensions
		 * @type {Array<string, Core.Interface.Extension>}
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
	 * @inheritDoc
	 * @override
	 * @method init
	 */
	init() {}

	/**
	 * @inheritDoc
	 * @override
	 * @method destroy
	 */
	destroy() {}

	/**
	 * @inheritDoc
	 * @override
	 * @method activate
	 */
	activate() {}

	/**
	 * @inheritDoc
	 * @override
	 * @method deactivate
	 */
	deactivate() {}

	/**
	 * @inheritDoc
	 * @abstract
	 * @override
	 * @method load
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the controller requires are ready. The
	 *         resolved values will be pushed to the controller's state.
	 */
	load() {
		throw new IMAError('The Core.Abstract.Controller.load method is ' +
				'abstract and must be overridden');
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method update
	 * @param {Object<string, string>=} [params={}] Last route params.
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the controller requires are ready. The
	 *         resolved values will be pushed to the controller's state.
	 */
	update(params = {}) {
		return this.getState();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setState
	 * @param {Object<string, *>} statePatch Patch of the controller's state to
	 *        apply.
	 */
	setState(statePatch) {
		if (this._pageStateManager) {
			this._pageStateManager.setState(statePatch);
		}
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getState
	 * @return {Object<string, *>} The current state of this controller.
	 */
	getState() {
		if (this._pageStateManager) {
			return this._pageStateManager.getState();
		} else {
			return {};
		}
	}

	/**
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method addExtension
	 * @param {Core.Interface.Extensions} extension
	 * @return {Core.Interface.Controller} This controller
	 */
	addExtension(extension) {
		this._extensions.push(extension);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getExtensions
	 * @return {Array<Core.Interface.Extension>}
	 */
	getExtensions() {
		return this._extensions;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @abstract
	 * @method setMetaParams
	 * @param {Object<string, *>} loadedResources Map of resource names to
	 *        resources loaded by the {@codelink load} method. This is the same
	 *        object as the one passed to the {@codelink setState} method when
	 *        the Promises returned by the {@codelink load} method were resolved.
	 * @param {Core.Interface.MetaManager} metaManager SEO attributes manager to configure.
	 * @param {Core.Interface.Router} router The current application router.
	 * @param {Core.Interface.Dictionary} dictionary The current localization
	 *        dictionary.
	 * @param {Object<string, *>} settings The application settings for the
	 *        current application environment.
	 */
	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		throw new IMAError('The Core.Abstract.Controller.setMetaParams method is ' +
				'abstract and must be overridden');
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setRouteParams
	 * @param {Object<string, string>=} [params={}] The current route parameters.
	 */
	setRouteParams(params = {}) {
		this.params = params;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getRouteParams
	 * @return {Object<string, string>} The current route parameters.
	 */
	getRouteParams() {
		return this.params;
	}

	/**
	 * @method setPageStateManager
	 * @param {Core.Interface.PageStateManager|Null} pageStateManager
	 */
	setPageStateManager(pageStateManager) {
		this._pageStateManager = pageStateManager;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getHttpStatus
	 * @return {number} The HTTP status code to send to the client.
	 */
	getHttpStatus() {
		return this.status;
	}
}

ns.Core.Abstract.Controller = Controller;
