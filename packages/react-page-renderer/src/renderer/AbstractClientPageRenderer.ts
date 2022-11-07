/* @if server **
export default class AbstractClientPageRenderer {};
/* @else */
import {
  Controller,
  ControllerDecorator,
  Dispatcher,
  MetaManager,
  RendererEvents,
  RendererTypes,
  Window,
} from '@ima/core';
import { RouteOptions } from '@ima/core/dist/esm/client/router/Router';
import * as Helpers from '@ima/helpers';
import { ComponentType } from 'react';

import { Settings } from '../types';
import AbstractPageRenderer, { PageData } from './AbstractPageRenderer';
import PageRendererFactory from './PageRendererFactory';

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
export default abstract class AbstractClientPageRenderer extends AbstractPageRenderer {
  /**
   * Flag signalling that the page is being rendered for the first time.
   */
  private _window: Window;
  protected _mounted = false;
  /**
   * The HTML element containing the current application view for the
   * current route.
   */
  protected _viewContainer?: Element;

  /**
   * Initializes the client-side page renderer.
   *
   * @param factory Factory for receive $Utils to view.
   * @param helpers The IMA.js helper methods.
   * @param dispatcher Dispatcher fires events to app.
   * @param settings The application setting for the
   *        current application environment.
   * @param window Helper for manipulating the global object
   *        (`window`) regardless of the client/server-side
   *        environment.
   */
  constructor(
    factory: PageRendererFactory,
    helpers: typeof Helpers,
    dispatcher: Dispatcher,
    settings: Settings,
    window: Window
  ) {
    super(factory, helpers, dispatcher, settings);

    /**
     * Helper for manipulating the global object (`window`)
     * regardless of the client/server-side environment.
     */
    this._window = window;
  }

  /**
   * @inheritDoc
   */
  async mount(
    controller: ControllerDecorator,
    pageView: ComponentType,
    pageResources: { [key: string]: Promise<unknown> },
    routeOptions: RouteOptions
  ): Promise<void | PageData> {
    const { values: defaultPageState, promises: loadedPromises } =
      this._separatePromisesAndValues(pageResources);

    if (this._viewContainer && this._viewContainer.children.length) {
      controller.setState(defaultPageState);
      await this._renderPageViewToDOM(controller, pageView, routeOptions);
      this._patchPromisesToState(controller, loadedPromises);
    }

    return this._helpers
      .allPromiseHash(loadedPromises)
      .then(async (fetchedResources: unknown) => {
        const pageState = Object.assign({}, defaultPageState, fetchedResources);

        if (!this._viewContainer || !this._viewContainer.children.length) {
          controller.setState(pageState);
          await this._renderPageViewToDOM(controller, pageView, routeOptions);
        }

        controller.setMetaParams(pageState);
        this._updateMetaAttributes(controller.getMetaManager());

        return {
          status: controller.getHttpStatus(),
        };
      })
      .catch((error: Error) => this._handleError(error));
  }

  setState(pageState = {}) {
    if (this._viewAdapter) {
      this._renderViewAdapter(this._getUpdateCallback(pageState), {
        state: pageState,
      });
    }
  }

  /**
   * @inheritDoc
   */
  update(
    controller: ControllerDecorator,
    pageView: ComponentType,
    resourcesUpdate: { [key: string]: unknown | Promise<unknown> }
  ): Promise<void | PageData> {
    const { values: defaultPageState, promises: updatedPromises } =
      this._separatePromisesAndValues(resourcesUpdate);

    controller.setState(defaultPageState);
    this._patchPromisesToState(controller, updatedPromises);

    return this._helpers
      .allPromiseHash(updatedPromises)
      .then(() => {
        controller.setMetaParams(controller.getState());
        this._updateMetaAttributes(controller.getMetaManager());

        return {
          status: controller.getHttpStatus(),
        };
      })
      .catch((error: Error) => this._handleError(error));
  }

  protected _getHydrateCallback() {
    return () =>
      this._dispatcher.fire(
        RendererEvents.MOUNTED,
        { type: RendererTypes.HYDRATE },
        true
      );
  }

  protected _getRenderCallback() {
    return () =>
      this._dispatcher.fire(
        RendererEvents.MOUNTED,
        { type: RendererTypes.RENDER },
        true
      );
  }

  protected _getUpdateCallback(pageState: unknown) {
    return () =>
      this._dispatcher.fire(RendererEvents.UPDATED, { pageState }, true);
  }

  /**
   * Show error to console in $Debug mode and re-throw that error
   * for other error handler.
   *
   * @throws {Error} Re-throws the handled error.
   */
  private _handleError(error: Error) {
    if ($Debug) {
      console.error('Render Error:', error);
    }

    throw error;
  }

  protected abstract _hydrateViewAdapter(): void;

  /**
   * Patch promise values to controller state.
   */
  private _patchPromisesToState(
    controller: ControllerDecorator,
    patchedPromises: { [key: string]: Promise<unknown> }
  ) {
    for (const resourceName of Object.keys(patchedPromises)) {
      patchedPromises[resourceName]
        .then(resource => {
          controller.setState({
            [resourceName]: resource,
          });
        })
        .catch(error => this._handleError(error));
    }

    this._startBatchTransactions(controller, patchedPromises);
  }

  protected _runUnmountCallback() {
    this._dispatcher.fire(
      RendererEvents.UNMOUNTED,
      { type: RendererTypes.UNMOUNT },
      true
    );
  }

  /**
   * Batch patch promise values to controller state.
   */
  private _startBatchTransactions(
    controller: ControllerDecorator,
    patchedPromises: { [key: string]: Promise<unknown> }
  ) {
    let hasResourcesLoaded = false;
    const options = {
      timeout: 100,
    };

    const Window = this._window.getWindow();
    let requestIdleCallback: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions | undefined
    ) => void = (callback: IdleRequestCallback) => setTimeout(callback, 0);
    if (Window && Window['requestIdleCallback']) {
      requestIdleCallback = Window.requestIdleCallback;
    }
    const handler = () => {
      controller.commitStateTransaction();

      if (!hasResourcesLoaded) {
        controller.beginStateTransaction();
        setTimeout(() => {
          requestIdleCallback(handler, options);
        }, 1000 / 60);
      }
    };

    controller.beginStateTransaction();
    requestIdleCallback(handler, options);

    this._helpers
      .allPromiseHash(patchedPromises)
      .then(() => {
        hasResourcesLoaded = true;
      })
      .catch(() => {
        hasResourcesLoaded = true;
      });
  }

  protected abstract _renderViewAdapter(
    callback: () => void,
    props?: unknown
  ): void;

  /**
   * Renders the current route to DOM.
   *
   * @param routeOptions The current route options.
   */
  private _renderPageViewToDOM(
    controller: Controller,
    pageView: ComponentType,
    routeOptions: RouteOptions
  ) {
    this._prepareViewAdapter(controller, pageView, routeOptions);

    const masterElementId = this._settings.$Page.$Render.masterElementId;
    const viewContainer = this._window.getElementById(
      masterElementId as string
    );
    if (viewContainer) {
      this._viewContainer = viewContainer;
    }

    if (!this._viewContainer) {
      const errorMessage =
        `ima.core.page.renderer.ClientPageRenderer:_renderPageViewToDOM: ` +
        `Element with ID "${masterElementId}" was not found in the DOM. ` +
        `Maybe the DOM is not in the interactive mode yet.`;

      this._dispatcher.fire(
        RendererEvents.ERROR,
        { message: errorMessage },
        true
      );

      return Promise.reject(new Error(errorMessage));
    }

    if (!this._mounted && this._viewContainer.children.length) {
      return new Promise(resolve => setTimeout(resolve, 1000 / 60)).then(() => {
        this._hydrateViewAdapter();
        this._mounted = true;
      });
    } else {
      this._renderViewAdapter(this._getRenderCallback());

      return Promise.resolve();
    }
  }

  /**
   * Separate promises and values from provided data map. Values will be use
   * for default page state. Promises will be patched to state after their
   * resolve.
   *
   * @param dataMap A map of data.
   * @return Return separated promises and other values.
   */
  private _separatePromisesAndValues(dataMap: { [key: string]: unknown }) {
    const promises: { [key: string]: Promise<unknown> } = {};
    const values: { [key: string]: unknown } = {};

    for (const field of Object.keys(dataMap)) {
      const value = dataMap[field];

      if (value instanceof Promise) {
        promises[field] = value;
      } else {
        values[field] = value;
      }
    }

    return { promises, values };
  }

  /**
   * Updates the title and the contents of the meta elements used for SEO.
   *
   * @param metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  private _updateMetaAttributes(metaManager: MetaManager) {
    this._window.setTitle(metaManager.getTitle());

    this._updateMetaNameAttributes(metaManager);
    this._updateMetaPropertyAttributes(metaManager);
    this._updateMetaLinkAttributes(metaManager);
  }

  /**
   * Updates the contents of the generic meta elements used for SEO.
   *
   * @param metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  private _updateMetaNameAttributes(metaManager: MetaManager) {
    for (const metaTagKey of metaManager.getMetaNames()) {
      const metaTag = this._window.querySelector(
        `meta[name="${metaTagKey}"]`
      ) as HTMLMetaElement;

      if (metaTag) {
        metaTag.content = metaManager.getMetaName(metaTagKey);
      }
    }
  }

  /**
   * Updates the contents of the specialized meta elements used for SEO.
   *
   * @param metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  private _updateMetaPropertyAttributes(metaManager: MetaManager) {
    for (const metaTagKey of metaManager.getMetaProperties()) {
      const metaTag = this._window.querySelector(
        `meta[property="${metaTagKey}"]`
      ) as HTMLMetaElement;

      if (metaTag) {
        metaTag.content = metaManager.getMetaProperty(metaTagKey);
      }
    }
  }

  /**
   * Updates the href of the specialized link elements used for SEO.
   *
   * @param metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  private _updateMetaLinkAttributes(metaManager: MetaManager) {
    for (const linkTagKey of metaManager.getLinks()) {
      const linkTag = this._window.querySelector(
        `link[rel="${linkTagKey}"]`
      ) as HTMLLinkElement;

      if (linkTag && linkTag.href) {
        linkTag.href = metaManager.getLink(linkTagKey);
      }
    }
  }
}
/* @endif */
