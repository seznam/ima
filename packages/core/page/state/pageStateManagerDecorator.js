import ns from 'ima/namespace';
import IMAError from 'ima/error/genericError';
import PageStateManagerInterface
		from 'ima/page/state/pageStateManager';

ns.namespace('Ima.Page.State');

/**
 * Decorator for page state manager, which add logic for limiting Extension
 * competence.
 *
 * @class PageStateManagerDecorator
 * @namespace Ima.Page.State
 * @module Ima
 * @submodule Ima.Page
 *
 * @extends Ima.Page.State.PageStateManager
 */
export default class PageStateManagerDecorator extends PageStateManagerInterface {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Ima.Page.State.PageStateManager} pageStateManager
	 * @param {Array<string>} allowedStateKeys
	 */
	constructor(pageStateManager, allowedStateKeys) {
		super();

		/**
		 * The current page state manager.
		 *
		 * @private
		 * @property _pageStateManager
		 * @type {Ima.Page.State.PageStateManager}
		 */
		this._pageStateManager = pageStateManager;

		/**
		 * Array of access keys for state.
		 *
		 * @private
		 * @property _allowedStateKeys
		 * @type {Array<string>}
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
			var patchKeys = Object.keys(statePatch);
			var deniedKeys = patchKeys.filter((patchKey) => {
				return this._allowedStateKeys.indexOf(patchKey) === -1;
			});

			if (deniedKeys.length > 0) {
				throw new IMAError(`Extension can not set state for keys ` +
						`${deniedKeys.join()}. Check your extension or add ` +
						`keys ${deniedKeys.join()} to getAllowedStateKeys.`);
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

ns.Ima.Page.State.PageStateManagerDecorator = PageStateManagerDecorator;
