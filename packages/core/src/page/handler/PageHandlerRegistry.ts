import { PageHandler } from './PageHandler';
import { GenericError } from '../../error/GenericError';
import { Execution } from '../../execution/Execution';
import { SerialBatch } from '../../execution/SerialBatch';
import { ManagedPage, PageAction } from '../PageTypes';

export class PageHandlerRegistry extends PageHandler {
  protected _pageHandlers: PageHandler[];
  protected _preManageHandlers?: Execution;
  protected _postManageHandlers?: Execution;

  static ExecutionMethod = SerialBatch;

  /**
   * Creates an instance of HandlerRegistry and creates `SerialBatch`
   * instance for pre-handlers and post-handlers.
   * @memberof HandlerRegistry
   */
  constructor(...pageHandlers: PageHandler[]) {
    super();

    this._pageHandlers = pageHandlers;
  }

  /**
   * @inheritDoc
   */
  init() {
    this._pageHandlers.forEach(handler => handler.init());

    this._preManageHandlers = Reflect.construct(
      PageHandlerRegistry.ExecutionMethod,
      [
        this._pageHandlers.map(handler =>
          handler.handlePreManagedState.bind(handler)
        ),
      ]
    );

    this._postManageHandlers = Reflect.construct(
      PageHandlerRegistry.ExecutionMethod,
      [
        this._pageHandlers.map(handler =>
          handler.handlePostManagedState.bind(handler)
        ),
      ]
    );
  }

  /**
   * Executes the pre-manage handlers with given arguments
   */
  handlePreManagedState(
    managedPage: ManagedPage | null,
    nextManagedPage: ManagedPage,
    action: PageAction
  ) {
    if (!this._preManageHandlers) {
      throw new GenericError('You must call init first.');
    }

    return this._preManageHandlers.execute(
      managedPage,
      nextManagedPage,
      action
    );
  }

  /**
   * Executes the post-manage handlers with given arguments
   */
  handlePostManagedState(
    managedPage: ManagedPage | null,
    previousManagedPage: ManagedPage,
    action: PageAction
  ) {
    return this?._postManageHandlers?.execute(
      managedPage,
      previousManagedPage,
      action
    ) as Promise<unknown>;
  }

  /**
   * @inheritDoc
   */
  destroy() {
    this._pageHandlers.forEach(handler => handler.destroy());

    this._preManageHandlers = undefined;
    this._postManageHandlers = undefined;
    this._pageHandlers = [];
  }
}
