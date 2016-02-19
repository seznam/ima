import ns from 'imajs/client/core/namespace';
import PageStateManager from 'imajs/client/core/interface/pageStateManager';

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
export default class StateManager extends PageStateManager {

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
		 * @type {(null|function(Object<string, *>))}
		 * @default null
		 */
		this.onChange = null;

	}

	/**
	 * @inheritdoc
	 * @method clear
	 */
	clear() {
		this._states = [];
		this._cursor = 0;
	}

	/**
	 * @inheritdoc
	 * @method setState
	 */
	setState(statePatch) {
		var newState = Object.assign({}, this.getState(), statePatch);

		this._eraseExcessHistory();
		this._pushToHistory(newState);
		this._callOnChangeCallback(newState);
	}

	/**
	 * @inheritdoc
	 * @method getState
	 */
	getState() {
		return this._states[this._cursor - 1] || {};
	}

	/**
	 * @inheritdoc
	 * @method getAllStates
	 */
	getAllStates() {
		return this._states;
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
	 */
	_callOnChangeCallback(newState) {
		if (this.onChange && typeof this.onChange === 'function') {
			this.onChange(newState);
		}
	}

}

ns.Core.Page.StateManager = StateManager;
