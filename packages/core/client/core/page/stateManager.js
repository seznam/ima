import ns from 'imajs/client/core/namespace';

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
export default class StateManager extends ns.Core.Interface.PageStateManager {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * @property _states
		 * @private
		 * @type {Array<Object<string, *>>}
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
		 * @default 10
		 */
		this.MAX_HISTORY_LIMIT = 10;

		/**
		 * @property onChange
		 * @public
		 * @type {(null|function(Object<string, *>, boolean))}
		 * @default null
		 */
		this.onChange = null;

	}

	/**
	 * @inheritDoc
	 * @override
	 * @method clear
	 */
	clear() {
		this._states = [];
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setState
	 * @param {Object<string, *>} statePatch
	 */
	setState(statePatch) {
		var newState = Object.assign({}, this.getState(), statePatch);

		this._setState(newState);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method replaceState
	 * @param {Object<string, *>} newState
	 */
	replaceState(newState) {
		this._setState(newState, true);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getState
	 * @return {Object<string, *>}
	 */
	getState() {
		return this._states[this._cursor - 1];
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getAllStates
	 * @return {Array<Object<string, *>>}
	 */
	getAllStates() {
		return this._states;
	}

	/**
	 * Set new app state.
	 *
	 * @method _setState
	 * @param {Object<string, *>} newState
	 * @param {boolean} [replaced=false]
	 */
	_setState(newState, replaced = false) {
		this._eraseExcessHistory();
		this._pushToHistory(newState);
		this._callOnChangeCallback(newState, replaced);
	}

	/**
	 * Erase the oldest state from storage only if it exceed max
	 * defined size of history.
	 *
	 * @private
	 * @method _eraseExcessHistory
	 */
	_eraseExcessHistory() {
		if (this._states.length > this.MAX_HISTORY_LIMIT) {
			this._states.shift();
			this._cursor -= 1;
		}
	}

	/**
	 * Push new state to history storage.
	 *
	 * @private
	 * @method _pushToHistory
	 * @param {Object<string, *>} newState
	 */
	_pushToHistory(newState) {
		this._states.push(newState);
		this._cursor += 1;
	}

	/**
	 * Call registered callback function on (@codelink onChange) with newState.
	 *
	 * @private
	 * @method _callOnChangeCallback
	 * @param {Object<string, *>} newState
	 * @param {boolean} replaced
	 */
	_callOnChangeCallback(newState, replaced) {
		if (this.onChange && typeof this.onChange === 'function') {
			this.onChange(newState, replaced);
		}
	}

}

ns.Core.Page.StateManager = StateManager;
