// @client-side
import {
  Controller,
  ControllerDecorator,
  Dispatcher,
  MetaManager,
  RendererEvents,
  RendererTypes,
  Window,
} from '@ima/core';
import { ComponentType, ReactElement } from 'react';
import { hydrate, render, unmountComponentAtNode } from 'react-dom';
import { Root } from 'react-dom/client';

import AbstractPageRenderer from './AbstractPageRenderer';
import PageRendererFactory from './PageRendererFactory';
import { Helpers, RouteOptions, Settings } from './types';

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
export default class ClientPageRenderer extends AbstractPageRenderer {
  /**
   * Flag signalling that the page is being rendered for the first time.
   */
  private _firstTime = true;
  private _window: Window;
  private _reactRoot?: Root;
  /**
   * The HTML element containing the current application view for the
   * current route.
   */
  private _viewContainer?: Element;

  /**
   * Initializes the client-side page renderer.
   *
   * @param factory Factory for receive $Utils to view.
   * @param helpers The IMA.js helper methods.
   * @param dispatcher Dispatcher fires events to app.
   * @param settings The application setting for the
   *        current application environment.
   * @param window Helper for manipulating the global object
   *        ({@code window}) regardless of the client/server-side
   *        environment.
   */
  constructor(
    factory: PageRendererFactory,
    helpers: Helpers,
    dispatcher: Dispatcher,
    settings: Settings,
    window: Window
  ) {
    super(factory, helpers, dispatcher, settings);

    /**
     * Helper for manipulating the global object ({@code window})
     * regardless of the client/server-side environment.
     */
    this._window = window;
  }

  /**
   * @inheritdoc
   */
  async mount(
    controller: ControllerDecorator,
    view: ComponentType,
    pageResources: { [key: string]: unknown | Promise<unknown> },
    routeOptions: RouteOptions
  ) {
    const separatedData = this._separatePromisesAndValues(pageResources);
    const defaultPageState = separatedData.values;
    const loadedPromises = separatedData.promises;

    if (!this._firstTime) {
      await this._renderToDOM(controller, view, routeOptions);
      this._patchPromisesToState(controller, loadedPromises);
    }

    return this._helpers
      .allPromiseHash(loadedPromises)
      .then(async (fetchedResources: unknown) => {
        const pageState = Object.assign({}, defaultPageState, fetchedResources);

        if (this._firstTime) {
          controller.setState(pageState);
          await this._renderToDOM(controller, view, routeOptions);
          this._firstTime = false;
        }

        controller.setMetaParams(pageState);
        this._updateMetaAttributes(controller.getMetaManager());

        return {
          content: null,
          status: controller.getHttpStatus(),
          pageState,
        };
      })
      .catch((error: Error) => this._handleError(error));
  }

  render(props = {}) {
    if (this._viewAdapter) {
      const renderCallback = () =>
        this._dispatcher.fire(RendererEvents.UPDATED, { props }, true);

      if (this._reactRoot) {
        const viewAdapterElement = this._getViewAdapterElement(
          Object.assign(props, {
            renderCallback,
          })
        );

        this._reactRoot.render(viewAdapterElement);
      } else if (this._viewContainer) {
        render(
          this._getViewAdapterElement(props) as ReactElement,
          this._viewContainer,
          renderCallback
        );
      }
    }
  }

  /**
   * @inheritdoc
   */
  update(
    controller: ControllerDecorator,
    view: ComponentType,
    resourcesUpdate: { [key: string]: unknown | Promise<unknown> }
  ) {
    const separatedData = this._separatePromisesAndValues(resourcesUpdate);
    const defaultPageState = separatedData.values;
    const updatedPromises = separatedData.promises;

    controller.setState(defaultPageState);
    this._patchPromisesToState(controller, updatedPromises);

    return this._helpers
      .allPromiseHash(updatedPromises)
      .then((fetchedResources: unknown) => {
        controller.setMetaParams(controller.getState());
        this._updateMetaAttributes(controller.getMetaManager());

        return {
          content: null,
          status: controller.getHttpStatus(),
          pageState: Object.assign({}, defaultPageState, fetchedResources),
        };
      })
      .catch((error: Error) => this._handleError(error));
  }

  /**
   * @inheritdoc
   */
  unmount() {
    if (this._viewContainer) {
      if (unmountComponentAtNode(this._viewContainer)) {
        this._dispatcher.fire(
          RendererEvents.UNMOUNTED,
          { type: RendererTypes.UNMOUNT },
          true
        );
      }
    }
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

  /**
   * Renders the current route to DOM.
   *
   * @param routeOptions The current route options.
   */
  private _renderToDOM(
    controller: Controller,
    view: ComponentType,
    routeOptions: RouteOptions
  ) {
    this._prepareViewAdapter(controller, view, routeOptions);

    const reactElementView = this._getViewAdapterElement() as ReactElement;
    const masterElementId = this._settings.$Page.$Render.masterElementId;
    this._viewContainer = this._window.getElementById(
      masterElementId as string
    );

    if (!this._viewContainer) {
      const errorMessage =
        `ima.core.page.renderer.ClientPageRenderer:_renderToDOM: ` +
        `Element with ID "${masterElementId}" was not found in the DOM. ` +
        `Maybe the DOM is not in the interactive mode yet.`;

      if ($Debug) {
        console.warn(errorMessage);
      }

      this._dispatcher.fire(
        RendererEvents.ERROR,
        { message: errorMessage },
        true
      );

      return Promise.resolve();
    }

    if (this._viewContainer.children.length) {
      return new Promise(resolve => setTimeout(resolve, 1000 / 60)).then(() => {
        hydrate(reactElementView, this._viewContainer as Element, () => {
          this._dispatcher.fire(
            RendererEvents.MOUNTED,
            { type: RendererTypes.HYDRATE },
            true
          );
        });
      });
    } else {
      render(reactElementView, this._viewContainer, () => {
        this._dispatcher.fire(
          RendererEvents.MOUNTED,
          { type: RendererTypes.RENDER },
          true
        );
      });
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
