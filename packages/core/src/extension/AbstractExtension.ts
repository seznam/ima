import Extension from './Extension';
import PageStateManager from '../page/state/PageStateManager';
import { StringParameters, UnknownParameters, UnknownPromiseParameters } from '../CommonTypes';

/**
 * Abstract extension
 *
 * @abstract
 * @implements Extension
 */
export default abstract class AbstractExtension implements Extension {
  /**
   * State manager.
   */
  protected _pageStateManager?: PageStateManager;
  /**
   * Flag indicating whether the PageStateManager should be used instead
   * of partial state.
   */
  protected _usingStateManager: boolean = false;
  protected _partialStateSymbol = Symbol('partialState');

  /**
   * The HTTP response code to send to the client.
   */
  status: number = 200;
  /**
   * The route parameters extracted from the current route.
   */
  params: StringParameters = {};

  [key: symbol]: UnknownParameters;

  /**
   * @inheritdoc
   */
  abstract init(): Promise<undefined> | void;

  /**
   * @inheritdoc
   */
  abstract destroy(): Promise<undefined> | void;

  /**
   * @inheritdoc
   */
  abstract activate(): Promise<undefined> | void;

  /**
   * @inheritdoc
   */
  abstract deactivate(): Promise<undefined> | void;

  /**
   * @inheritdoc
   * @abstract
   */
  abstract load():
    | Promise<UnknownPromiseParameters>
    | UnknownPromiseParameters;

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
