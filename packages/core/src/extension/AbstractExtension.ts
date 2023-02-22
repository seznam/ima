/* eslint-disable @typescript-eslint/no-empty-function */

import { Extension } from './Extension';
import { GenericError } from '../error/GenericError';
import { EventBusEventHandler } from '../event/EventBus';
import { PageStateManager } from '../page/state/PageStateManager';
import { UnknownParameters, UnknownPromiseParameters } from '../types';

/**
 * Abstract extension
 */
export abstract class AbstractExtension extends Extension {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: PropertyKey]: any | EventBusEventHandler | UnknownParameters;

  /**
   * State manager.
   */
  protected _pageStateManager?: PageStateManager;
  /**
   * Flag indicating whether the PageStateManager should be used instead
   * of partial state.
   */
  protected _usingStateManager = false;
  protected _partialStateSymbol = Symbol('partialState');

  /**
   * The HTTP response code to send to the client.
   */
  status = 200;
  /**
   * The route parameters extracted from the current route.
   */
  params: UnknownParameters = {};

  /**
   * @inheritDoc
   */
  init(): Promise<undefined> | void {}

  /**
   * @inheritDoc
   */
  destroy(): Promise<undefined> | void {
    return;
  }

  /**
   * @inheritDoc
   */
  activate(): Promise<undefined> | void {
    return;
  }

  /**
   * @inheritDoc
   */
  deactivate(): Promise<undefined> | void {
    return;
  }

  /**
   * @inheritDoc
   */
  load(): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    throw new GenericError(
      'The ima.core.extension.AbstractExtension.load method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * @inheritDoc
   */
  update() {
    return {};
  }

  /**
   * @inheritDoc
   */
  setState(statePatch: UnknownParameters) {
    if (this._pageStateManager) {
      this._pageStateManager.setState(statePatch);
    }
  }

  /**
   * @inheritDoc
   */
  getState() {
    if (this._usingStateManager && this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return this.getPartialState();
    }
  }

  /**
   * @inheritDoc
   */
  beginStateTransaction() {
    if (this._pageStateManager) {
      this._pageStateManager.beginTransaction();
    }
  }

  /**
   * @inheritDoc
   */
  commitStateTransaction() {
    if (this._pageStateManager) {
      this._pageStateManager.commitTransaction();
    }
  }

  /**
   * @inheritDoc
   */
  cancelStateTransaction() {
    if (this._pageStateManager) {
      this._pageStateManager.cancelTransaction();
    }
  }

  /**
   * @inheritDoc
   */
  setPartialState(partialStatePatch: UnknownParameters) {
    const newPartialState = Object.assign(
      {},
      this[this._partialStateSymbol],
      partialStatePatch
    );
    this[this._partialStateSymbol] = newPartialState;
  }

  /**
   * @inheritDoc
   */
  getPartialState() {
    return this[this._partialStateSymbol] || {};
  }

  /**
   * @inheritDoc
   */
  clearPartialState() {
    this[this._partialStateSymbol] = {};
  }

  /**
   * @inheritDoc
   */
  setRouteParams(params = {}) {
    this.params = params;
  }

  /**
   * @inheritDoc
   */
  getRouteParams() {
    return this.params;
  }

  /**
   * @inheritDoc
   */
  setPageStateManager(pageStateManager?: PageStateManager) {
    this._pageStateManager = pageStateManager;
  }

  /**
   * @inheritDoc
   */
  switchToStateManager() {
    this._usingStateManager = true;
  }

  /**
   * @inheritDoc
   */
  switchToPartialState() {
    this._usingStateManager = false;
  }

  /**
   * @inheritDoc
   */
  getHttpStatus() {
    return this.status;
  }

  /**
   * Returns array of allowed state keys for extension.
   */
  getAllowedStateKeys() {
    return [];
  }
}
