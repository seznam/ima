import { AbstractConstructor, Constructor } from 'type-fest';

import { Controller } from './Controller';
import { OCAliasMap } from '../config/bind';
import { Extension } from '../extension/Extension';
import { Dependencies } from '../oc/ObjectContainer';
import { PageState, PageStateManager } from '../page/state/PageStateManager';
import { RouteParams } from '../router/AbstractRoute';

/**
 * Basic implementation of the {@link Controller} interface, providing the
 * default implementation of the most of the API.
 */
export class AbstractController<
  S extends PageState = {},
  R extends RouteParams = {},
  SS extends S = S
> extends Controller<S, R, SS> {
  protected _pageStateManager?: PageStateManager<SS>;
  protected _extensions: Map<
    | keyof OCAliasMap
    | Constructor<Extension<any, any>>
    | AbstractConstructor<Extension<any, any>>,
    InstanceType<typeof Extension>
  > = new Map();
  /**
   * The HTTP response code to send to the client.
   */
  status = 200;
  /**
   * The route parameters extracted from the current route. This field is
   * set externally by IMA right before the {@link Controller#init} or the
   * {@link Controller#update} method is called.
   */
  params: R = {} as R;

  static $name?: string;
  static $dependencies: Dependencies;
  static $extensions?: Dependencies<Extension<any, any>>;

  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  setState<K extends keyof S>(statePatch: Pick<S, K> | S | null): void {
    if (this._pageStateManager) {
      this._pageStateManager.setState(statePatch as S);
    }
  }

  /**
   * @inheritDoc
   */
  getState(): SS {
    if (this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return {} as SS;
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
    extension:
      | keyof OCAliasMap
      | Constructor<Extension<any, any>>
      | AbstractConstructor<Extension<any, any>>
      | InstanceType<typeof Extension>,
    extensionInstance?: InstanceType<typeof Extension>
  ): void {
    // FIXME IMA@20, remove backwards compatibility
    if (
      (!extensionInstance && typeof extension !== 'object') ||
      (extensionInstance && typeof extensionInstance !== 'object')
    ) {
      throw new Error(
        `ima.core.AbstractController:addExtension: Expected instance of an extension, got ${typeof extension}.`
      );
    }

    if (extensionInstance) {
      this._extensions.set(
        extension as Constructor<Extension>,
        extensionInstance
      );
    } else {
      this._extensions.set(
        (extension?.constructor as typeof Extension) ?? extension,
        extension as unknown as InstanceType<typeof Extension>
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
  setRouteParams(params: R = {} as R) {
    this.params = params;
  }

  /**
   * @inheritDoc
   */
  getRouteParams(): R {
    return this.params;
  }

  /**
   * @inheritDoc
   */
  setPageStateManager(pageStateManager?: PageStateManager<SS>): void {
    this._pageStateManager = pageStateManager;
  }

  /**
   * @inheritDoc
   */
  getHttpStatus(): number {
    return this.status;
  }
}
