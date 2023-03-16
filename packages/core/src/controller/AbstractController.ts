import PageStateManager from '../page/state/PageStateManager';
import Controller from './Controller';
import Extension, { IExtension } from '../extension/Extension';
import { UnknownParameters } from '../CommonTypes';

/**
 * Basic implementation of the {@link Controller} interface, providing the
 * default implementation of the most of the API.
 */
export default abstract class AbstractController extends Controller {
  protected _pageStateManager?: PageStateManager;
  protected _extensions: Map<Extension | IExtension, Extension> = new Map();
  /**
   * The HTTP response code to send to the client.
   */
  status = 200;
  /**
   * The route parameters extracted from the current route. This field is
   * set externally by IMA right before the {@link Controller#init} or the
   * {@link Controller#update} method is called.
   */
  params: UnknownParameters = {};

  static get $extensions(): IExtension[] {
    return [];
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
    if (this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return {};
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
  addExtension(
    extension: Extension | IExtension,
    extensionInstance?: Extension
  ) {
    if (typeof extensionInstance !== 'object') {
      throw new Error(
        `ima.core.AbstractController:addExtension: Expected instance of an extension, got ${typeof extension}.`
      );
    }

    this._extensions.set(
      extension,
      extensionInstance ? extensionInstance : (extension as Extension)
    );
  }

  /**
   * @inheritDoc
   */
  getExtension(extension: IExtension) {
    return this._extensions.get(extension);
  }

  /**
   * @inheritDoc
   */
  getExtensions() {
    return Array.from(this._extensions.values());
  }

  /**
   * @inheritDoc
   */
  setRouteParams(params: UnknownParameters = {}) {
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
  getHttpStatus() {
    return this.status;
  }
}
