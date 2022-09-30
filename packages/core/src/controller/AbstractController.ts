import PageStateManager from '../page/state/PageStateManager';
import Controller from './Controller';
import Extension, { IExtension } from '../extension/Extension';
import { StringParameters, UnknownParameters, UnknownPromiseParameters } from '../CommonTypes';

/**
 * Basic implementation of the {@link Controller} interface, providing the
 * default implementation of the most of the API.
 *
 * @abstract
 * @extends Controller
 */
export default abstract class AbstractController extends Controller {
  protected _pageStateManager?: PageStateManager;
  protected _extensions: Map<Extension | IExtension, Extension> = new Map();
  /**
   * The HTTP response code to send to the client.
   */
  status: number = 200;
  /**
   * The route parameters extracted from the current route. This field is
   * set externally by IMA right before the {@link Controller#init} or the
   * {@link Controller#update} method is called.
   */
  params: StringParameters = {};

  static get $extensions(): IExtension[] {
    return [];
  }

  /**
   * @inheritdoc
   */
  abstract init(): void;

  /**
   * @inheritdoc
   */
  abstract destroy(): void;

  /**
   * @inheritdoc
   */
  abstract activate(): void;

  /**
   * @inheritdoc
   */
  abstract deactivate(): void;

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
    if (this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return {};
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
  addExtension(extension: Extension | IExtension, extensionInstance?: Extension) {
    if (!extensionInstance && typeof extension !== 'object') {
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
   * @inheritdoc
   */
  getExtension(extension: IExtension) {
    return this._extensions.get(extension);
  }

  /**
   * @inheritdoc
   */
  getExtensions() {
    return Array.from(this._extensions.values());
  }

  /**
   * @inheritdoc
   * @abstract
   */
  abstract setMetaParams(): void;

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
  getHttpStatus() {
    return this.status;
  }
}
