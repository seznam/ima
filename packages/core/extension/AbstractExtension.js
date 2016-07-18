import ns from 'ima/namespace';
import IMAError from 'ima/error/GenericError';
import ExtensionInterface from 'ima/extension/Extension';

ns.namespace('ima.extension');

/**
 * Abstract extension
 *
 * @class AbstractExtension
 * @namespace ima.extension
 * @module ima
 * @submodule ima.extension
 *
 * @extends ima.extension.Extension
 */
export default class AbstractExtension extends ExtensionInterface {

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
		 * @type {ima.page.state.PageStateManager}
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
		throw new IMAError('The ima.extension.AbstractExtension.load method is ' +
				'abstract and must be overridden');
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

	/**
	 * Returns array of allowed state keys for extension.
	 *
	 * @inheritdoc
	 * @method getAllowedStateKeys
	 */
	getAllowedStateKeys() {
		return [];
	}
}

ns.ima.extension.AbstractExtension = AbstractExtension;
