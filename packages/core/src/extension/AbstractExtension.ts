import { Extension } from './Extension';
import { Dependencies, RouteParams } from '..';
import { GenericError } from '../error/GenericError';
import { EventBusEventHandler } from '../event/EventBus';
import { PageStateManager } from '../page/state/PageStateManager';
import { UnknownParameters, UnknownPromiseParameters } from '../types';

/**
 * Abstract extension
 */
export abstract class AbstractExtension extends Extension {
  static $name?: string;
  static $dependencies: Dependencies;

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
  params: RouteParams = {};

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
  load(): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    throw new GenericError(
      'The ima.core.extension.AbstractExtension.load method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * @inheritDoc
   */
  update(
    prevParams: RouteParams
  ): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    return {};
  }

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
    if (this._usingStateManager && this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return this.getPartialState();
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
  setPartialState(partialStatePatch: UnknownParameters): void {
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
  getPartialState(): UnknownParameters {
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
  setRouteParams(params: RouteParams = {}): void {
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
  getAllowedStateKeys(): string[] {
    return [];
  }
}
