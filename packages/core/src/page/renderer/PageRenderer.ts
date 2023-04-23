import { RendererEvents } from './RendererEvents';
import { RendererTypes } from './RendererTypes';
import { Controller } from '../../controller/Controller';
import { RouteOptions } from '../../router/Router';
import {
  AnyParameters,
  UnknownParameters,
  UnknownPromiseParameters,
} from '../../types';
import { PageData } from '../PageTypes';

export interface PageRendererDispatcherEvents {
  [RendererEvents.ERROR]: { message: string };
  [RendererEvents.HYDRATE_ERROR]: {
    error: Error;
    serverNode: Element;
    clientNode: Element;
  };
  [RendererEvents.MOUNTED]: {
    type: RendererTypes.HYDRATE | RendererTypes.RENDER;
  };
  [RendererEvents.UNMOUNTED]: { type: RendererTypes.UNMOUNT };
  [RendererEvents.UPDATED]: {
    pageState: AnyParameters;
  };
}

/**
 * The page renderer is a utility for rendering the page at either the
 * client-side or the server-side, handling the differences in the environment.
 */
export abstract class PageRenderer {
  /**
   * Renders the page using the provided controller and view. The actual
   * behavior of this method differs at the client-side and the at
   * server-side in the following way:
   *
   * At the server, the method first waits for all the resources to load, and
   * then renders the page to a string containing HTML markup to send to the
   * client.
   *
   * At the client, the method uses the already available resources to render
   * the page into DOM, re-using the DOM created from the HTML markup send by
   * the server if possible. After this the method will re-render the page
   * every time another resource being loaded finishes its loading and
   * becomes available.
   *
   * Note that the method renders the page at the client-side only after all
   * resources have been loaded if this is the first time this method is
   * invoked at the client.
   *
   * @param controller The current page controller.
   * @param view The page's view.
   * @param pageResources The resources for
   *        the view loaded by the controller.
   * @param routeOptions The current route options.
   * @return A promise that will resolve to information about the
   *         rendered page. The `status` will contain the HTTP status
   *         code to send to the client (at the server side) or determine the
   *         type of error page to navigate to (at the client side).
   */
  mount(
    controller: Controller,
    view: unknown,
    pageResources: UnknownPromiseParameters,
    routeOptions: RouteOptions
  ): Promise<void | PageData> {
    return Promise.reject();
  }

  /**
   * Handles update of the current route that does not replace the current
   * controller and view.
   *
   * The method will use the already available resource to update the
   * controller's state and the view immediately. After that, the method will
   * update the controller's state and view with every resource that becomes
   * resolved.
   *
   * @param controller The current page controller.
   * @param view The page's view.
   * @param resourcesUpdate The resources
   *        that represent the update the of current state according to the
   *        current route and its parameters.
   * @param routeOptions The current route options.
   * @return A promise that will resolve to information about the
   *         rendered page. The `status` will contain the HTTP status
   *         code to send to the client (at the server side) or determine the
   *         type of error page to navigate to (at the client side).
   *         The `content` field will contain the rendered markup of
   *         the page at the server-side, or `null` at the client-side.
   */
  update(
    controller: Controller,
    view: unknown,
    resourcesUpdate: UnknownPromiseParameters,
    routeOptions: RouteOptions
  ): Promise<void | PageData> {
    return Promise.reject();
  }

  /**
   * Unmounts the view from the DOM.
   *
   * This method has no effect at the server-side.
   */
  unmount() {
    return;
  }

  /**
   * Sets the provided state to the currently rendered view.
   *
   * This method has no effect at the server-side.
   *
   * @param state The state to set to the currently
   *        rendered view.
   */
  setState(state: UnknownParameters): Promise<void> {
    return Promise.reject();
  }
}
