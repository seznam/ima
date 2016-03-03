import ns from 'ima/namespace';

ns.namespace('ima.page.state');

/**
 * Manager of the current page state and state history.
 *
 * @interface PageStateManager
 * @namespace ima.page.state
 * @module ima
 * @submodule ima.page
 */
export default class PageStateManager {

	/**
	 * Clears the state history.
	 *
	 * @method clear
	 */
	clear() {}

	/**
	 * Sets a new page state by applying the provided patch to the current
	 * state.
	 *
	 * @method setState
	 * @param {Object<string, *>} statePatch The patch of the current state.
	 */
	setState(statePatch) {}

	/**
	 * Returns the current page state.
	 *
	 * @method getState
	 * @return {Object<string, *>} The current page state.
	 */
	getState() {}

	/**
	 * Returns the recorded history of page states. The states will be
	 * chronologically sorted from the oldest to the newest.
	 *
	 * Note that the implementation may limit the size of the recorded history,
	 * therefore the complete history may not be available.
	 *
	 * @method getAllStates
	 * @return {Array<Object<string, *>>} The recorded history of page states.
	 */
	getAllStates() {}

}

ns.ima.page.state.PageStateManager = PageStateManager;
