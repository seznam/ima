import PageHandler from './PageHandler';
import SerialBatch from '../../execution/SerialBatch';

export default class PageHandlerRegistry extends PageHandler {
  /**
   * Creates an instance of HandlerRegistry and creates {@code SerialBatch}
   * instance for pre-handlers and post-handlers.
   *
   * @param {...PageHandler} pageHandlers
   * @memberof HandlerRegistry
   */
  constructor(...pageHandlers) {
    super(...pageHandlers);

    /**
     * Page handlers.
     *
     * @protected
     * @type {PageHandler[]}
     */
    this._pageHandlers = pageHandlers;

    /**
     * Page handlers.
     *
     * @protected
     * @type {Execution}
     */
    this._preManageHandlers = pageHandlers;

    /**
     * Page handlers.
     *
     * @protected
     * @type {Execution}
     */
    this._postManageHandlers = pageHandlers;
  }

  /**
   * @inheritdoc
   */
  init() {
    this.pageHandlers.forEach(handler => handler.init());

    this._preManageHandlers = Reflect.construct(
      PageHandlerRegistry.ExecutionMethod,
      [
        this._pageHandlers.map(handler =>
          handler.handlePreManagedState.bind(handler)
        )
      ]
    );

    this._postManageHandlers = Reflect.construct(
      PageHandlerRegistry.ExecutionMethod,
      [
        this._pageHandlers.map(handler =>
          handler.handlePostManagedState.bind(handler)
        )
      ]
    );
  }

  /**
   * Executes the pre-manage handlers with given arguments
   *
   * @param {?ManagedPage} managedPage
   * @param {?ManagedPage} nextManagedPage
   * @param {{ type: string, event: Event, url: string }} action
   * @return {Promise<any>}
   */
  handlePreManagedState(managedPage, nextManagedPage, action) {
    return this._preManageHandlers.execute(
      managedPage,
      nextManagedPage,
      action
    );
  }

  /**
   * Executes the post-manage handlers with given arguments
   *
   * @param {?ManagedPage} managedPage
   * @param {?ManagedPage} previousManagedPage
   * @param {{ type: string, event: Event, url: string }} action
   * @return {Promise<any>}
   */
  handlePostManagedState(managedPage, previousManagedPage, action) {
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
    this.pageHandlers.forEach(handler => handler.destroy());

    this._preManageHandlers = null;
    this._postManageHandlers = null;
    this._pageHandlers = null;
  }
}

PageHandlerRegistry.ExecutionMethod = SerialBatch;
