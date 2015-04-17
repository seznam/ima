import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Interface');

/**
 * Page state.
 *
 * @interface PageState
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class PageState {

	/**
	 * Set state.
	 *
	 * @method setState
	 * @param {Object} state
	 */
	setState(state) {}

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

ns.Core.Interface.PageState = PageState;