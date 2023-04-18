import { Extension } from './Extension';
import { GenericError } from '../error/GenericError';
import { EventBusEventHandler } from '../event/EventBus';
import { Dependencies } from '../oc/ObjectContainer';
import { PageState, PageStateManager } from '../page/state/PageStateManager';
import { RouteParams } from '../router/AbstractRoute';

/**
 * Abstract extension
 */
export abstract class AbstractExtension<
  S extends PageState = {},
  R extends RouteParams = {},
  SS extends S = S
> extends Extension<S, R, SS> {
  static $name?: string;
  static $dependencies: Dependencies;

  [key: PropertyKey]: any | EventBusEventHandler;

  /**
   * State manager.
   */
  protected _pageStateManager?: PageStateManager<SS>;
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
  params: R = {} as R;

  /**
   * @inheritDoc
   */
  init(): Promise<void> | void {
    return;
  }

  /**
   * @inheritDoc
   */
  destroy(): Promise<void> | void {
    return;
  }

  /**
   * @inheritDoc
   */
  activate(): Promise<void> | void {
    return;
  }

  /**
   * @inheritDoc
   */
  deactivate(): Promise<void> | void {
    return;
  }

  /**
   * @inheritDoc
   */
  load(): Promise<S> | S {
    throw new GenericError(
      'The ima.core.extension.AbstractExtension.load method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * @inheritDoc
   */
  update(prevParams: R = {} as R): Promise<S> | S {
    return {} as S;
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
    if (this._usingStateManager && this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return this.getPartialState() as SS;
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
  setPartialState(partialStatePatch: S): void {
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
  getPartialState(): Partial<SS> {
    return this[this._partialStateSymbol] || {};
  }

  /**
   * @inheritDoc
   */
  clearPartialState(): void {
    this[this._partialStateSymbol] = {};
  }

  /**
   * @inheritDoc
   */
  setRouteParams(params: R = {} as R): void {
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
  switchToStateManager(): void {
    this._usingStateManager = true;
  }

  /**
   * @inheritDoc
   */
  switchToPartialState(): void {
    this._usingStateManager = false;
  }

  /**
   * @inheritDoc
   */
  getHttpStatus(): number {
    return this.status;
  }

  /**
   * Returns array of allowed state keys for extension.
   */
  getAllowedStateKeys(): (keyof S)[] {
    return [];
  }
}
