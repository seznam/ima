import PageStateManager from './PageStateManager';

const MAX_HISTORY_LIMIT = 10;

/**
 * The implementation of the {@linkcode PageStateManager} interface.
 */
export default class PageStateManagerImpl extends PageStateManager {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the page state manager.
   */
  constructor() {
    super();

    /**
     * @type {Object<string, *>[]}
     */
    this._states = [];

    /**
     * @type {number}
     */
    this._cursor = -1;

    /**
     * @type {?function(Object<string, *>)}
     */
    this.onChange = null;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._states = [];
    this._cursor = -1;
  }

  /**
   * @inheritdoc
   */
  setState(statePatch) {
    var newState = Object.assign({}, this.getState(), statePatch);

    this._eraseExcessHistory();
    this._pushToHistory(newState);
    this._callOnChangeCallback(newState);
  }

  /**
   * @inheritdoc
   */
  getState() {
    return this._states[this._cursor] || {};
  }

  /**
   * @inheritdoc
   */
  getAllStates() {
    return this._states;
  }

  /**
   * Erase the oldest state from storage only if it exceed max
   * defined size of history.
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
   * @param {Object<string, *>} newState
   */
  _pushToHistory(newState) {
    this._states.push(newState);
    this._cursor += 1;
  }

  /**
   * Call registered callback function on (@codelink onChange) with newState.
   *
   * @param {Object<string, *>} newState
   */
  _callOnChangeCallback(newState) {
    if (this.onChange && typeof this.onChange === 'function') {
      this.onChange(newState);
    }
  }
}
