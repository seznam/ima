import { PageState, PageStateManager } from './PageStateManager';
import { StateEvents } from './StateEvents';
import { Dispatcher } from '../../event/Dispatcher';
import { AnyParameters } from '../../types';

const MAX_HISTORY_LIMIT = 10;

export interface PageStateDispatcherEvents {
  [StateEvents.AFTER_CHANGE_STATE]: {
    newState: AnyParameters;
  };
  [StateEvents.BEFORE_CHANGE_STATE]: {
    newState: AnyParameters;
    oldState: AnyParameters;
    patchState: AnyParameters | null;
  };
}

/**
 * The implementation of the {@link PageStateManager} interface.
 */
export class PageStateManagerImpl<
  S extends PageState = {}
> extends PageStateManager<S> {
  private _cursor = -1;
  private _dispatcher: Dispatcher;
  private _ongoingTransaction = false;
  private _statePatchQueue: (Pick<S, any> | S | null)[] = [];
  private _states: S[] = [];

  static get $dependencies() {
    return [Dispatcher];
  }

  /**
   * Initializes the page state manager.
   *
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   */
  constructor(dispatcher: Dispatcher) {
    super();

    this._dispatcher = dispatcher;
  }

  /**
   * @inheritDoc
   */
  clear(): void {
    this._states = [];
    this._cursor = -1;

    this.cancelTransaction();
  }

  /**
   * @inheritDoc
   */
  setState<K extends keyof S>(
    patchState: Pick<S, K> | S | null
  ): void | number {
    if (this._ongoingTransaction) {
      return this._statePatchQueue.push(patchState);
    }

    const oldState = this.getState();
    const newState = Object.assign({}, this.getState(), patchState);

    if (this._dispatcher) {
      this._dispatcher.fire(
        StateEvents.BEFORE_CHANGE_STATE,
        { newState, oldState, patchState },
        true
      );
    }

    this._eraseExcessHistory();
    this._pushToHistory(newState);
    this._callOnChangeCallback(newState);
  }

  /**
   * @inheritDoc
   */
  getState(): S {
    return this._states[this._cursor] || {};
  }

  /**
   * @inheritDoc
   */
  getAllStates(): S[] {
    return this._states;
  }

  /**
   * @inheritDoc
   */
  getTransactionStatePatches(): (Pick<S, any> | S | null)[] {
    return this._statePatchQueue;
  }

  /**
   * @inheritDoc
   */
  beginTransaction(): void {
    if ($Debug && this._ongoingTransaction) {
      console.warn(
        'ima.core.page.state.PageStateManagerImpl.beginTransaction():' +
          'Another state transaction is already in progress. Check you workflow.' +
          'These uncommitted state changes will be lost:',
        this._statePatchQueue
      );
    }

    this._ongoingTransaction = true;
    this._statePatchQueue = [];
  }

  /**
   * @inheritDoc
   */
  commitTransaction(): void {
    if ($Debug && !this._ongoingTransaction) {
      console.warn(
        'ima.core.page.state.PageStateManagerImpl.commitTransaction():' +
          'No transaction is in progress. Check you workflow.'
      );
    }

    if (this._statePatchQueue.length === 0) {
      this._ongoingTransaction = false;

      return;
    }

    const finalPatch = Object.assign({}, ...this._statePatchQueue);

    this._ongoingTransaction = false;
    this._statePatchQueue = [];

    this.setState(finalPatch);
  }

  /**
   * @inheritDoc
   */
  cancelTransaction(): void {
    this._ongoingTransaction = false;
    this._statePatchQueue = [];
  }

  /**
   * Erase the oldest state from storage only if it exceed max
   * defined size of history.
   */
  _eraseExcessHistory(): void {
    if (this._states.length > MAX_HISTORY_LIMIT) {
      this._states.shift();
      this._cursor -= 1;
    }
  }

  /**
   * Push new state to history storage.
   */
  _pushToHistory(newState: S): void {
    this._states.push(newState);
    this._cursor += 1;
  }

  /**
   * Call registered callback function on (@link onChange) with newState.
   */
  _callOnChangeCallback(newState: S): void {
    if (this.onChange && typeof this.onChange === 'function') {
      this.onChange(newState);
    }

    if (this._dispatcher) {
      this._dispatcher.fire(StateEvents.AFTER_CHANGE_STATE, { newState }, true);
    }
  }
}
