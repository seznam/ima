import { AbstractRoute } from '@ima/core';

import PageHandlerAction from '../handler/PageHandlerAction';
import RouteOptions from './RouteOptions';

/**
 * The page manager is a utility for managing the current controller and its
 * view.
 */
export default interface PageManagerInterface {
  /**
   * Initializes the page manager.
   */
  init(): void;

  /**
   * Starts to manage the provided controller and its view. The manager
   * stops the management of any previously managed controller and view.
   *
   * The controller and view will be initialized and rendered either into the
   * UI (at the client-side) or to the response to send to the client (at the
   * server-side).
   *
   * @param route A route instance that holds information about the
   *        page we should manage.
   * @param options The current route options.
   * @param params The route parameters of the
   *        current route.
   * @param action An action object describing what triggered the routing.
   * @return A promise that will resolve to information about the rendered page.
   *         The {@code status} will contain the HTTP status code to send to the
   *         client (at the server side) or determine the type of error page
   *         to navigate to (at the client side).
   *         The {@code content} field will contain the rendered markup of
   *         the page at the server-side, or {@code null} at the client-side.
   */
  manage(route: AbstractRoute, options: RouteOptions, params: { [key: string]: string }, action: PageHandlerAction): Promise<{ content?: string; pageState: { [key: string]: any }; status: number; }>;

  /**
   * Finalization callback, called when the page manager is being discarded.
   * This usually happens when the page is hot-reloaded at the client side.
   */
  destroy(): Promise<void>;
}
