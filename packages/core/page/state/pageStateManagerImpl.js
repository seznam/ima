import ns from 'ima/namespace';
import PageStateManagerInterface from 'ima/page/state/pageStateManager';

ns.namespace('ima.page.state');

const MAX_HISTORY_LIMIT = 10;

/**
 * Class for app state.
 *
 * @class PageStateManagerImpl
 * @implements ima.page.state.PageStateManager
 * @namespace ima.page.state
 * @module ima
 * @submodule ima.page
 */
export default class PageStateManagerImpl extends PageStateManagerInterface {

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
		this._cursor = -1;

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
		this._cursor = -1;
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
		return this._states[this._cursor] || {};
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
		if (this._states.length > MAX_HISTORY_LIMIT) {
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

ns.ima.page.state.PageStateManagerImpl = PageStateManagerImpl;
