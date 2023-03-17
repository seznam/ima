/* eslint-disable @typescript-eslint/no-unused-vars */

import { ManagedPage, PageAction } from '../PageTypes';

export abstract class PageHandler {
  /**
   * Initializes the page handler.
   */
  init() {
    return;
  }

  /**
   * Called before a PageManager starts to transition from previous page to
   * a new one.
   *
   * @param managedPage The currently managed page - soon-to-be
   *        previously managed page.
   * @param nextManagedPage The data of the page that's about to
   *        be managed.
   * @param action An action object describing what triggered the routing.
   */
  handlePreManagedState(
    managedPage: ManagedPage | null,
    nextManagedPage: ManagedPage,
    action: PageAction
  ) {
    return;
  }

  /**
   * Called after a PageManager finishes transition from previous page to
   * a new one.
   *
   * @param managedPage The currently managed page.
   * @param previousManagedPage The data of the page that was
   *        previously managed.
   * @param action An action object describing what triggered the routing.
   */
  handlePostManagedState(
    managedPage: ManagedPage | null,
    previousManagedPage: ManagedPage,
    action: PageAction
  ) {
    return;
  }

  /**
   * Finalization callback, called when the page manager is being discarded.
   * This usually happens when the page is hot-reloaded at the client side.
   */
  destroy() {
    return;
  }
}
