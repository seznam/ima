import Execution from '../../execution/Execution';
import GenericError from '../../error/GenericError';
import PageHandler, { ManagedPage, PageAction } from './PageHandler';
import SerialBatch from '../../execution/SerialBatch';

export default class PageHandlerRegistry extends PageHandler {
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
   * @inheritdoc
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
  handlePreManagedState(managedPage: ManagedPage, nextManagedPage: ManagedPage, action: PageAction) {
    if (!this._preManageHandlers) {
      throw new GenericError(
        'You must call init first.'
      );
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
  handlePostManagedState(managedPage: ManagedPage, previousManagedPage: ManagedPage, action: PageAction) {
    if (!this._postManageHandlers) {
      throw new GenericError(
        'You must call init first.'
      );
    }

    return this._postManageHandlers.execute(
      managedPage,
      previousManagedPage,
      action
    );
  }

  /**
   * @inheritdoc
   */
  destroy() {
    this._pageHandlers.forEach(handler => handler.destroy());

    this._preManageHandlers = undefined;
    this._postManageHandlers = undefined;
    this._pageHandlers = [];
  }
}
