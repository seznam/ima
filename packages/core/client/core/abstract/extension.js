import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';

ns.namespace('Core.Abstract');

/**
 * Abstract extension
 *
 * @class Extension
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 *
 * @extends Core.Interface.Extension
 */
export default class Extension extends ns.Core.Interface.Extension {

	/**
	 * @method constructor
	 * @constructor
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
	 *         resolved when all resources the extension requires are ready. The
	 *         resolved values will be pushed to the extension's state.
	 */
	load() {
		throw new IMAError('The Core.Abstract.Extension.load method is ' +
				'abstract and must be overridden');
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method update
	 * @param {Object<string, string>=} [params={}] Last route params.
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the extension requires are ready. The
	 *         resolved values will be pushed to the extension's state.
	 */
	update(params = {}) {
		return this.getState();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setState
	 * @param {Object<string, *>} statePatch Patch of the extension's state to
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
	 * @return {Object<string, *>} The current state of this extension.
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

	/**
	 * Returns array of allowed state keys for extension.
	 *
	 * @inheritDoc
	 * @override
	 * @method getAllowedStateKeys
	 * @return {Array<string>} The allowed state keys.
	 */
	getAllowedStateKeys() {
		return [];
	}
}

ns.Core.Abstract.Extension = Extension;
