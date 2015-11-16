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
	 * Set new state as smooth copy last state and state patch.
	 *
	 * @method setState
	 * @param {Object<string, *>} statePatch
	 */
	setState(statePatch) {}

	/**
	 * Returns page state.
	 *
	 * @method getState
	 * @return {Object<string, *>}
	 */
	getState() {}

	/**
	 * Return all history of states.
	 *
	 * @method getAllStates
	 * @return {Array<Object<string, *>>}
	 */
	getAllStates() {}

}

ns.Core.Interface.PageStateManager = PageStateManager;
