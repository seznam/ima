import Extension from './Extension';
import GenericError from '../error/GenericError';

/**
 * Abstract extension
 *
 * @abstract
 * @extends Extension
 */
export default class AbstractExtension extends Extension {
  constructor() {
    super();

    /**
     * State manager.
     *
     * @protected
     * @type {PageStateManager}
     */
    this._pageStateManager = null;

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

    this._partialStateSymbol = Symbol('partialState');
  }

  /**
   * @inheritdoc
   */
  init() {}

  /**
   * @inheritdoc
   */
  destroy() {}

  /**
   * @inheritdoc
   */
  activate() {}

  /**
   * @inheritdoc
   */
  deactivate() {}

  /**
   * @inheritdoc
   * @abstract
   */
  load() {
    throw new GenericError(
      'The ima.extension.AbstractExtension.load method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * @inheritdoc
   */
  update(params = {}) {
    return {};
  }

  /**
   * @inheritdoc
   */
  setState(statePatch) {
    if (this._pageStateManager) {
      this._pageStateManager.setState(statePatch);
    }
  }

  setPartialState(partialStatePatch) {
    var newPartialState = Object.assign(
      {},
      this[this._partialStateSymbol],
      partialStatePatch
    );
    this[this._partialStateSymbol] = newPartialState;
  }

  /**
   * @inheritdoc
   */
  getState() {
    if (this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return this.getPartialState();
    }
  }

  getPartialState() {
    return this[this._partialStateSymbol] || {};
  }

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
  setPageStateManager(pageStateManager) {
    this._pageStateManager = pageStateManager;
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
