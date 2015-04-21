import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Page');

/**
 * Class for app state.
 *
 * @class StateManager
 * @implements Core.Interface.PageStateManager
 * @namespace Core.Page
 * @module Core
 * @submodule Core.Page
 */
class StateManager extends ns.Core.Interface.PageStateManager {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * @property _states
		 * @private
		 * @type {array}
		 * @default []
		 */
		this._states = [];

		/**
		 * @property _cursor
		 * @private
		 * @type {Number}
		 * @default 0
		 */
		this._cursor = 0;

		/**
		 * @property MAX_HISTORY_LIMIT
		 * @const
		 * @type {Number}
		 * @default 5
		 */
		this.MAX_HISTORY_LIMIT = 5;

		/**
		 * @property onChange
		 * @public
		 * @type {function}
		 * @default null
		 */
		this.onChange = null;

	}

	/**
	 * Set state.
	 *
	 * @method setState
	 * @param {Object} state
	 */
	setState(state) {
		
		if (this._states.length > this.MAX_HISTORY_LIMIT) {
			this._states.shift();
			this._cursor--;
		}

		this._states.push(state);
		this._cursor++;

		if (this.onChange && typeof this.onChange === 'function') {
			this.onChange(state);
		}
	}

	/**
	 * Patch state.
	 *
	 * @method patchState
	 * @param {Object} statePatch
	 */
	patchState(statePatch) {
		var newState = Object.assign({}, this.getState(), statePatch);
		this.setState(newState);
	}

	/**
	 * Get state.
	 *
	 * @method getState
	 * @return {Object}
	 */
	getState() {
		return this._states[this._cursor - 1];
	}

	/**
	 * Get all history state.
	 *
	 * @method getAllStates
	 * @return {array}
	 */
	getAllStates() {
		return this._states;
	}

}

ns.Core.Page.StateManager = StateManager;