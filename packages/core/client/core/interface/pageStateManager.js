import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Interface');

/**
 * Page state.
 *
 * @interface PageStateManager
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class PageStateManager {

	/**
	 * Clear history.
	 *
	 * @method clear
	 */
	clear() {}

	/**
	 * Set state.
	 *
	 * @method setState
	 * @param {Object} state
	 */
	setState(state) {}

	/**
	 * Patch state.
	 *
	 * @method patchState
	 * @param {Object} statePatch
	 */
	patchState(statePatch) {}

	/**
	 * Get state.
	 *
	 * @method getState
	 * @return {Object}
	 */
	getState() {}

	/**
	 * Get all history states.
	 *
	 * @method getAllStates
	 * @return {array}
	 */
	getAllStates() {}

}

ns.Core.Interface.PageStateManager = PageStateManager;
