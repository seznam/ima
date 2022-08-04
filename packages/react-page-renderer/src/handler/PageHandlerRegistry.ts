import { Execution, SerialBatch } from '@ima/core';

import ManagedPage from '../manager/ManagedPage';
import PageHandlerAction from './PageHandlerAction';
import PageHandlerInterface from './PageHandlerInterface';

export default class PageHandlerRegistry implements PageHandlerInterface {
  static ExecutionMethod = SerialBatch;

  protected _pageHandlers: PageHandlerInterface[] | null;
  protected _postManageHandlers: Execution | null = null;
  protected _preManageHandlers: Execution | null = null;

  /**
   * Creates an instance of HandlerRegistry and creates {@code SerialBatch}
   * instance for pre-handlers and post-handlers.
   * 
   * @memberof HandlerRegistry
   */
  constructor(...pageHandlers: PageHandlerInterface[]) {
    /**
     * Page handlers.
     */
    this._pageHandlers = pageHandlers;
  }

  /**
   * @inheritdoc
   */
  init() {
    this._pageHandlers!.forEach(handler => handler.init());

    this._preManageHandlers = Reflect.construct(
      PageHandlerRegistry.ExecutionMethod,
      [
        this._pageHandlers!.map(handler =>
          handler.handlePreManagedState.bind(handler)
        ),
      ]
    );

    this._postManageHandlers = Reflect.construct(
      PageHandlerRegistry.ExecutionMethod,
      [
        this._pageHandlers!.map(handler =>
          handler.handlePostManagedState.bind(handler)
        ),
      ]
    );
  }

  /**
   * Executes the pre-manage handlers with given arguments
   *
   * @param managedPage
   * @param nextManagedPage
   * @param action
   * @return {Promise<any>}
   */
  handlePreManagedState(managedPage: ManagedPage, nextManagedPage: ManagedPage, action: PageHandlerAction) {
    return this._preManageHandlers!.execute(
      managedPage,
      nextManagedPage,
      action
    );
  }

  /**
   * Executes the post-manage handlers with given arguments
   *
   * @param managedPage
   * @param previousManagedPage
   * @param action
   * @return {Promise<any>}
   */
  handlePostManagedState(managedPage: ManagedPage, previousManagedPage: ManagedPage, action: PageHandlerAction) {
    return this._postManageHandlers!.execute(
      managedPage,
      previousManagedPage,
      action
    );
  }

  /**
   * @inheritdoc
   */
  destroy() {
    this._pageHandlers!.forEach(handler => handler.destroy());

    this._preManageHandlers = null;
    this._postManageHandlers = null;
    this._pageHandlers = null;
  }
}
