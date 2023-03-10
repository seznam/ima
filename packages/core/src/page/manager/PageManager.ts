import { AbstractRoute } from '../../router/AbstractRoute';
import { RouteExecutor } from '../../router/AbstractRouter';
import { RouteOptions } from '../../router/Router';
import { UnknownParameters } from '../../types';
import { PageAction } from '../PageTypes';

export type ManageArgs = {
  route: InstanceType<typeof AbstractRoute>;
  options: RouteOptions;
  params?: UnknownParameters;
  action?: PageAction;
  routeExecutor: RouteExecutor;
};

/**
 * The page manager is a utility for managing the current controller and its
 * view.
 */
export abstract class PageManager {
  /**
   * Initializes the page manager.
   */
  init() {
    return;
  }

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
   *         The `status` will contain the HTTP status code to send to the
   *         client (at the server side) or determine the type of error page
   *         to navigate to (at the client side).
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  manage(args: ManageArgs): Promise<unknown> {
    return Promise.reject();
  }

  /**
   * Finalization callback, called when the page manager is being discarded.
   * This usually happens when the page is hot-reloaded at the client side.
   */
  destroy(): Promise<unknown> {
    return Promise.reject();
  }
}
