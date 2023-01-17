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
import type {
  UnknownParameters,
  UnknownPromiseParameters,
  RouteOptions,
} from '@ima/core';
import {
  MetaManagerRecordNames,
  MetaManagerRecord,
  MetaAttributes,
} from '@ima/core/dist/esm/client/meta/MetaManager';
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
  private _hydrated = false;
  private _mounted = this._createMountedPromise();
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

    if (this._viewContainer && this._viewContainer.children.length) {
      controller.setState(defaultPageState);
      await this._renderPageViewToDOM(controller, pageView, routeOptions);
      this._patchPromisesToState(controller, loadedPromises);
    }

    return this._helpers
      .allPromiseHash(loadedPromises)
      .then(async (fetchedResources: unknown) => {
        const pageState = Object.assign({}, defaultPageState, fetchedResources);

        const isViewContainerEmpty =
          !this._viewContainer || !this._viewContainer.children.length;

        isViewContainerEmpty && controller.setState(pageState);

        controller.getMetaManager().clearMetaAttributes();
        controller.setMetaParams(pageState);

        isViewContainerEmpty &&
          (await this._renderPageViewToDOM(controller, pageView, routeOptions));

        this._updateMetaAttributes(controller.getMetaManager());

        return {
          pageState: controller.getState(),
          status: controller.getHttpStatus(),
        };
      })
      .catch((error: Error) => this._handleError(error));
  }

  /**
   * @inheritDoc
   */
  update(
    controller: ControllerDecorator,
    pageView: ComponentType,
    resourcesUpdate: UnknownPromiseParameters
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
          pageState: controller.getState(),
          status: controller.getHttpStatus(),
        };
      })
      .catch((error: Error) => this._handleError(error));
  }

  unmount(): void {
    this._hydrated = false;
    this._mounted = this._createMountedPromise();
  }

  async setState(pageState = {}) {
    await this._mounted;

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
      this._dispatcher.listen(RendererEvents.MOUNTED, () => resolve());
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
        .catch(error => this._handleError(error));
    }
  }

  protected _runUnmountCallback() {
    this._dispatcher.fire(
      RendererEvents.UNMOUNTED,
      { type: RendererTypes.UNMOUNT },
      true
    );
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

    if (!this._hydrated && this._viewContainer.children.length) {
      return new Promise(resolve => setTimeout(resolve, 1000 / 60)).then(() => {
        this._hydrateViewAdapter();
        this._hydrated = true;

        return this._mounted;
      });
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

  /**
   * Update specified meta or link tags in DOM.
   *
   * @param metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  private _updateMetaAttributes(metaManager: MetaManager) {
    this._window.setTitle(metaManager.getTitle());

    // Remove IMA managed meta tags
    this._window
      .querySelectorAll(`[data-ima-meta]`)
      .forEach(el => (el as HTMLElement)?.remove());

    this.#updateMetaTag<'href'>(metaManager.getLinksIterator(), 'link', 'href');
    this.#updateMetaTag<'property'>(
      metaManager.getMetaPropertiesIterator(),
      'meta',
      'property'
    );
    this.#updateMetaTag<'content'>(
      metaManager.getMetaNamesIterator(),
      'meta',
      'content'
    );
  }

  #updateMetaTag<R extends MetaManagerRecordNames>(
    iterator: IterableIterator<[string, MetaManagerRecord<R>]> | never[],
    tagName: 'link' | 'meta',
    valueName: MetaManagerRecordNames
  ): void {
    const document = this._window.getDocument();

    if (!document) {
      return;
    }

    for (const [key, value] of iterator) {
      const attributes = {
        [tagName === 'link' ? 'rel' : 'name']: key,
        ...(typeof value === 'object' ? value : { [valueName]: value }),
      } as MetaAttributes;

      // TODO IMA@19 - remove backwards compatibility
      const existingMetaTag = this._window.querySelector(`meta[name="${key}"]`);

      if (existingMetaTag) {
        existingMetaTag[valueName] = attributes[valueName] as string;
        return;
      }

      // TODO IMA@19 - following should be default from IMA@19
      const metaTag = document.createElement(tagName);
      metaTag.setAttribute('data-ima-meta', '');

      for (const [attrName, attrValue] of Object.entries(attributes)) {
        // Skip invalid values
        if (attrValue === undefined || attrValue === null) {
          continue;
        }

        metaTag?.setAttribute(attrName, attrValue.toString());
      }

      document?.head.appendChild(metaTag);
    }
  }
}
/* @endif */
