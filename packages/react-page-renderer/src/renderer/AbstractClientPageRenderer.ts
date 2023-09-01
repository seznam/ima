/* @if server **
export class AbstractClientPageRenderer {};
/* @else */
import { autoYield, forceYield } from '@esmj/task';
import {
  Controller,
  ControllerDecorator,
  Dispatcher,
  RendererEvents,
  RendererTypes,
  Window,
  type UnknownParameters,
  type UnknownPromiseParameters,
  type RouteOptions,
  type Settings,
} from '@ima/core';
import * as Helpers from '@ima/helpers';
import { ComponentType } from 'react';

import { AbstractPageRenderer, PageData } from './AbstractPageRenderer';
import { PageRendererFactory } from './PageRendererFactory';

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
export abstract class AbstractClientPageRenderer extends AbstractPageRenderer {
  private _hydrated = false;
  private _mounted = this._createMountedPromise();
  private _syncMouted = false;
  private _renderedOnChange = true;
  /**
   * Flag signalling that the page is being rendered for the first time.
   */
  private _window: Window;
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

    await forceYield();

    let batchPromise: Promise<unknown> = Promise.resolve();
    if (this._viewContainer && this._viewContainer.children.length) {
      this._renderedOnChange = false;
      controller.setState(defaultPageState);
      this._renderedOnChange = true;

      await this._renderPageViewToDOM(controller, pageView, routeOptions);
      this._patchPromisesToState(controller, loadedPromises);

      if (this._settings?.$Page?.$Render?.batchResolve) {
        batchPromise = this._startBatchTransactions(controller, loadedPromises);
      }
    }

    return batchPromise.then(() => {
      return this._helpers
        .allPromiseHash(loadedPromises)
        .then(async (fetchedResources: unknown) => {
          const pageState = Object.assign(
            {},
            defaultPageState,
            fetchedResources
          );

          const isViewContainerEmpty =
            !this._viewContainer || !this._viewContainer.children.length;
          isViewContainerEmpty && controller.setState(pageState);
          controller.setMetaParams(pageState);

          isViewContainerEmpty &&
            (await this._renderPageViewToDOM(
              controller,
              pageView,
              routeOptions
            ));

          return {
            pageState: controller.getState(),
            status: controller.getHttpStatus(),
          };
        })
        .catch((error: Error) => this._handleError(error));
    });
  }

  /**
   * @inheritDoc
   */
  async update(
    controller: ControllerDecorator,
    pageView: ComponentType,
    resourcesUpdate: UnknownPromiseParameters
  ): Promise<void | PageData> {
    const { values: defaultPageState, promises: updatedPromises } =
      this._separatePromisesAndValues(resourcesUpdate);

    await autoYield();
    controller.setState(defaultPageState);

    this._patchPromisesToState(controller, updatedPromises);
    let batchPromise: Promise<unknown> = Promise.resolve();
    if (this._settings?.$Page?.$Render?.batchResolve) {
      batchPromise = this._startBatchTransactions(controller, updatedPromises);
    }

    return batchPromise.then(() => {
      return this._helpers
        .allPromiseHash(updatedPromises)
        .then(() => {
          controller.setMetaParams(controller.getState());

          return {
            pageState: controller.getState(),
            status: controller.getHttpStatus(),
          };
        })
        .catch((error: Error) => this._handleError(error));
    });
  }

  unmount(): void {
    this._hydrated = false;
    this._syncMouted = false;
    this._mounted = this._createMountedPromise();
  }

  async setState(pageState = {}) {
    if (!this._syncMouted) {
      await this._mounted;
    }

    if (!this._renderedOnChange) {
      return;
    }

    this._renderViewAdapter(this._getUpdateCallback(pageState), {
      state: pageState,
    });
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

  private _createMountedPromise(): Promise<void> {
    return new Promise(resolve => {
      this._dispatcher.listen(RendererEvents.MOUNTED, () => {
        this._syncMouted = true;
        resolve();
      });
    });
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
        .catch(error => this._handleError(error as Error));
    }
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
    patchedPromises: UnknownPromiseParameters
  ): Promise<unknown> {
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
      requestIdleCallback = (callback, options) =>
        Window.requestIdleCallback(callback, options);
    }

    const handler = (resolve: () => void) => () => {
      controller.commitStateTransaction();

      if (!hasResourcesLoaded) {
        controller.beginStateTransaction();
        setTimeout(() => {
          requestIdleCallback(handler(resolve), options);
        }, 75);
      } else {
        resolve();
      }
    };

    controller.beginStateTransaction();
    const batchPromise = new Promise<void>(resolve => {
      setTimeout(() => {
        requestIdleCallback(handler(resolve), options);
      }, 100);
    });

    this._helpers
      .allPromiseHash(patchedPromises)
      .then(() => {
        hasResourcesLoaded = true;
      })
      .catch(() => {
        hasResourcesLoaded = true;
      });

    return batchPromise;
  }

  protected abstract _renderViewAdapter(
    callback?: () => void,
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
    const viewContainer = this._window.getElementById(masterElementId);
    if (viewContainer) {
      this._viewContainer = viewContainer;
    }

    if (!this._viewContainer) {
      const errorMessage =
        `ima.core.page.renderer.ClientPageRenderer:_renderPageViewToDOM: ` +
        `Element with ID "${
          masterElementId || 'unknown'
        }" was not found in the DOM. ` +
        `Maybe the DOM is not in the interactive mode yet.`;

      this._dispatcher.fire(
        RendererEvents.ERROR,
        { message: errorMessage },
        true
      );

      return Promise.reject(new Error(errorMessage));
    }

    if (!this._hydrated && this._viewContainer.children.length) {
      this._hydrateViewAdapter();
      this._hydrated = true;

      return this._mounted;
    } else {
      this._renderViewAdapter(this._getRenderCallback());

      return this._mounted;
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
  private _separatePromisesAndValues(dataMap: UnknownParameters) {
    const promises: { [key: string]: Promise<unknown> } = {};
    const values: UnknownParameters = {};

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
}
/* @endif */
