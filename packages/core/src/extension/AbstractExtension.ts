/* eslint-disable @typescript-eslint/no-empty-function */

import Extension from './Extension';
import PageStateManager from '../page/state/PageStateManager';
import { UnknownParameters, UnknownPromiseParameters } from '../CommonTypes';
import { EventHandler } from '../page/PageTypes';
import GenericError from '../error/GenericError';

/**
 * Abstract extension
 */
export default abstract class AbstractExtension implements Extension {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: PropertyKey]: any | EventHandler | UnknownParameters;

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
   * @inheritdoc
   */
  init(): Promise<undefined> | void {}

  /**
   * @inheritdoc
   */
  destroy(): Promise<undefined> | void {
    return;
  }

  /**
   * @inheritdoc
   */
  activate(): Promise<undefined> | void {
    return;
  }

  /**
   * @inheritdoc
   */
  deactivate(): Promise<undefined> | void {
    return;
  }

  /**
   * @inheritdoc
   */
  load(): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    throw new GenericError(
      'The ima.core.extension.AbstractExtension.load method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * @inheritdoc
   */
  update() {
    return {};
  }

  /**
   * @inheritdoc
   */
  setState(statePatch: UnknownParameters) {
    if (this._pageStateManager) {
      this._pageStateManager.setState(statePatch);
    }
  }

  /**
   * @inheritdoc
   */
  getState() {
    if (this._usingStateManager && this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return this.getPartialState();
    }
  }

  /**
   * @inheritdoc
   */
  beginStateTransaction() {
    if (this._pageStateManager) {
      this._pageStateManager.beginTransaction();
    }
  }

  /**
   * @inheritdoc
   */
  commitStateTransaction() {
    if (this._pageStateManager) {
      this._pageStateManager.commitTransaction();
    }
  }

  /**
   * @inheritdoc
   */
  cancelStateTransaction() {
    if (this._pageStateManager) {
      this._pageStateManager.cancelTransaction();
    }
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
   */
  getPartialState() {
    return this[this._partialStateSymbol] || {};
  }

  /**
   * @inheritdoc
   */
  clearPartialState() {
    this[this._partialStateSymbol] = {};
  }

  /**
   * @inheritdoc
   */
  setRouteParams(params = {}) {
    this.params = params;
  }

  /**
   * @inheritdoc
   */
  getRouteParams() {
    return this.params;
  }

  /**
   * @inheritdoc
   */
  setPageStateManager(pageStateManager?: PageStateManager) {
    this._pageStateManager = pageStateManager;
  }

  /**
   * @inheritdoc
   */
  switchToStateManager() {
    this._usingStateManager = true;
  }

  /**
   * @inheritdoc
   */
  switchToPartialState() {
    this._usingStateManager = false;
  }

  /**
   * @inheritdoc
   */
  getHttpStatus() {
    return this.status;
  }

  /**
   * Returns array of allowed state keys for extension.
   *
   * @inheritdoc
   */
  getAllowedStateKeys() {
    return [];
  }
}
