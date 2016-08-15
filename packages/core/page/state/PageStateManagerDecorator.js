import ns from '../../namespace';
import PageStateManager from './PageStateManager';
import GenericError from '../../error/GenericError';

ns.namespace('ima.page.state');

/**
 * Decorator for page state manager, which add logic for limiting Extension
 * competence.
 *
 * @class PageStateManagerDecorator
 * @implements PageStateManager
 * @namespace ima.page.state
 * @module ima
 * @submodule ima.page
 */
export default class PageStateManagerDecorator extends PageStateManager {

	/**
	 * @method constructor
	 * @constructor
	 * @param {PageStateManager} pageStateManager
	 * @param {string[]} allowedStateKeys
	 */
	constructor(pageStateManager, allowedStateKeys) {
		super();

		/**
		 * The current page state manager.
		 *
		 * @private
		 * @property _pageStateManager
		 * @type {PageStateManager}
		 */
		this._pageStateManager = pageStateManager;

		/**
		 * Array of access keys for state.
		 *
		 * @private
		 * @property _allowedStateKeys
		 * @type {string[]}
		 */
		this._allowedStateKeys = allowedStateKeys;
	}

	/**
	 * @inheritdoc
	 * @method clear
	 */
	clear() {
		this._pageStateManager.clear();
	}

	/**
	 * @inheritdoc
	 * @method setState
	 */
	setState(statePatch) {
		if ($Debug) {
			let patchKeys = Object.keys(statePatch);
			let deniedKeys = patchKeys.filter((patchKey) => {
				return this._allowedStateKeys.indexOf(patchKey) === -1;
			});

			if (deniedKeys.length > 0) {
				throw new GenericError(`Extension can not set state for ` +
						`keys ${deniedKeys.join()}. Check your extension or ` +
						`add keys ${deniedKeys.join()} to ` +
						`getAllowedStateKeys.`);
			}
		}

		this._pageStateManager.setState(statePatch);
	}

	/**
	 * @inheritdoc
	 * @method getState
	 */
	getState() {
		return this._pageStateManager.getState();
	}

	/**
	 * @inheritdoc
	 * @method getAllStates
	 */
	getAllStates() {
		return this._pageStateManager.getAllStates();
	}
}

ns.ima.page.state.PageStateManagerDecorator = PageStateManagerDecorator;
