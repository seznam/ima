import ns from '../../namespace';
import PageStateManager from './PageStateManager';
import GenericError from '../../error/GenericError';

ns.namespace('ima.page.state');

/**
 * Decorator for page state manager, which add logic for limiting Extension
 * competence.
 */
export default class PageStateManagerDecorator extends PageStateManager {
	/**
	 * Initializes the page state manager decorator.
	 *
	 * @param {PageStateManager} pageStateManager
	 * @param {string[]} allowedStateKeys
	 */
	constructor(pageStateManager, allowedStateKeys) {
		super();

		/**
		 * The current page state manager.
		 *
		 * @type {PageStateManager}
		 */
		this._pageStateManager = pageStateManager;

		/**
		 * Array of access keys for state.
		 *
		 * @type {string[]}
		 */
		this._allowedStateKeys = allowedStateKeys;
	}

	/**
	 * @inheritdoc
	 */
	clear() {
		this._pageStateManager.clear();
	}

	/**
	 * @inheritdoc
	 */
	setState(statePatch) {
		if ($Debug) {
			let patchKeys = Object.keys(statePatch);
			let deniedKeys = patchKeys.filter(patchKey => {
				return this._allowedStateKeys.indexOf(patchKey) === -1;
			});

			if (deniedKeys.length > 0) {
				throw new GenericError(
					`Extension can not set state for keys ` +
						`${deniedKeys.join()}. Check your extension or add keys ` +
						`${deniedKeys.join()} to getAllowedStateKeys.`
				);
			}
		}

		this._pageStateManager.setState(statePatch);
	}

	/**
	 * @inheritdoc
	 */
	getState() {
		return this._pageStateManager.getState();
	}

	/**
	 * @inheritdoc
	 */
	getAllStates() {
		return this._pageStateManager.getAllStates();
	}
}

ns.ima.page.state.PageStateManagerDecorator = PageStateManagerDecorator;
