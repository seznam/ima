import Extension from './Extension';
import PageStateManager from '../page/state/PageStateManager';

/**
 * Abstract extension
 *
 * @abstract
 * @implements Extension
 */
export default abstract class AbstractExtension implements Extension {
  protected _pageStateManager: PageStateManager | null;
  protected _usingStateManager: boolean;
  protected _partialStateSymbol = Symbol('partialState');
  public status: number;
  public params: { [key: string]: string };

  [key: symbol]: { [key: string]: unknown };

  constructor() {
    /**
     * State manager.
     *
     * @protected
     * @type {PageStateManager}
     */
    this._pageStateManager = null;

    /**
     * Flag indicating whether the PageStateManager should be used instead
     * of partial state.
     *
     * @protected
     * @type {boolean}
     */
    this._usingStateManager = false;

    /**
     * The HTTP response code to send to the client.
     *
     * @type {number}
     */
    this.status = 200;

    /**
     * The route parameters extracted from the current route.
     *
     * @type {Object<string, string>}
     */
    this.params = {};
  }

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
    | Promise<{ [key: string]: Promise<unknown> | unknown }>
    | { [key: string]: Promise<unknown> | unknown };

  /**
   * @inheritdoc
   */
  update() {
    return {};
  }

  /**
   * @inheritdoc
   */
  setState(statePatch: { [key: string]: unknown }) {
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
  setPartialState(partialStatePatch: { [key: string]: unknown }) {
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
  setPageStateManager(pageStateManager: PageStateManager) {
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
