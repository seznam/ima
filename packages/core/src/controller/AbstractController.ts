import { Controller } from './Controller';
import { Dependencies, RouteParams } from '..';
import { Extension } from '../extension/Extension';
import { PageStateManager } from '../page/state/PageStateManager';
import { UnknownParameters } from '../types';

/**
 * Basic implementation of the {@link Controller} interface, providing the
 * default implementation of the most of the API.
 */
export class AbstractController extends Controller {
  protected _pageStateManager?: PageStateManager;
  protected _extensions: Map<typeof Extension, InstanceType<typeof Extension>> =
    new Map();
  /**
   * The HTTP response code to send to the client.
   */
  status = 200;
  /**
   * The route parameters extracted from the current route. This field is
   * set externally by IMA right before the {@link Controller#init} or the
   * {@link Controller#update} method is called.
   */
  params: RouteParams = {};

  static $name?: string;
  static $dependencies: Dependencies;
  static $extensions?: Dependencies;

  /**
   * @inheritDoc
   */
  setState(statePatch: UnknownParameters): void {
    if (this._pageStateManager) {
      this._pageStateManager.setState(statePatch);
    }
  }

  /**
   * @inheritDoc
   */
  getState(): UnknownParameters {
    if (this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return {};
    }
  }

  /**
   * @inheritDoc
   */
  beginStateTransaction(): void {
    if (this._pageStateManager) {
      this._pageStateManager.beginTransaction();
    }
  }

  /**
   * @inheritDoc
   */
  commitStateTransaction(): void {
    if (this._pageStateManager) {
      this._pageStateManager.commitTransaction();
    }
  }

  /**
   * @inheritDoc
   */
  cancelStateTransaction(): void {
    if (this._pageStateManager) {
      this._pageStateManager.cancelTransaction();
    }
  }

  /**
   * @inheritDoc
   */
  addExtension(
    extension: typeof Extension | InstanceType<typeof Extension>,
    extensionInstance?: InstanceType<typeof Extension>
  ): void {
    if (
      (!extensionInstance && typeof extension !== 'object') ||
      (extensionInstance && typeof extensionInstance !== 'object')
    ) {
      throw new Error(
        `ima.core.AbstractController:addExtension: Expected instance of an extension, got ${typeof extension}.`
      );
    }

    if (extensionInstance) {
      this._extensions.set(extension as typeof Extension, extensionInstance);
    } else {
      this._extensions.set(
        (extension?.constructor ?? extension) as typeof Extension,
        extension as InstanceType<typeof Extension>
      );
    }
  }

  /**
   * @inheritDoc
   */
  getExtension(
    extension: typeof Extension
  ): InstanceType<typeof Extension> | undefined {
    return this._extensions.get(extension);
  }

  /**
   * @inheritDoc
   */
  getExtensions(): Extension[] {
    return Array.from(this._extensions.values());
  }

  /**
   * @inheritDoc
   */
  setRouteParams(params: RouteParams = {}) {
    this.params = params;
  }

  /**
   * @inheritDoc
   */
  getRouteParams(): RouteParams {
    return this.params;
  }

  /**
   * @inheritDoc
   */
  setPageStateManager(pageStateManager?: PageStateManager): void {
    this._pageStateManager = pageStateManager;
  }

  /**
   * @inheritDoc
   */
  getHttpStatus(): number {
    return this.status;
  }
}
