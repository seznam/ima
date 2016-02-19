import ns from 'ima/namespace';

ns.namespace('Ima.Interface');

/**
 * Page state.
 *
 * @interface PageStateManager
 * @namespace Ima.Interface
 * @module Ima
 * @submodule Ima.Interface
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

ns.Ima.Interface.PageStateManager = PageStateManager;
