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

        if (!this._viewContainer || !this._viewContainer.children.length) {
          controller.setState(pageState);
          await this._renderPageViewToDOM(controller, pageView, routeOptions);
        }

        controller.getMetaManager().clearMetaAttributes();
        controller.setMetaParams(pageState);
        this._updateMetaAttributes(controller.getMetaManager());

        return {
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
   * @param elName Name of the element
   * @param elProperty Primary property of given element
   * @param elements Array of element identifiers stored in MetaManager
   */
  private _updateMetaTagsOfType(
    elName: 'link' | 'meta',
    elProperty: 'rel' | 'property' | 'name',
    elements: Record<string, MetaAttributes>
  ) {
    // Remove rendered elementss
    this._window
      .querySelectorAll(`${elName}[${elProperty}][data-ima-meta]`)
      .forEach(renderedMetaTag => {
        renderedMetaTag.remove();
      });

    // Render new elements
    Object.keys(elements).forEach(elementKey => {
      const newMetaTag = this._window.getDocument().createElement(elName);
      newMetaTag.setAttribute(elProperty, elementKey);

      Object.keys(elements[elementKey]).forEach(newMetaAttribute => {
        newMetaTag.setAttribute(
          newMetaAttribute,
          elements[elementKey][newMetaAttribute] as string
        );
      });
      newMetaTag.setAttribute('data-ima-meta', '');
      this._window.querySelector('head').appendChild(newMetaTag);
    });
  }

  /**
   * Updates the title and the contents of the meta elements used for SEO.
   *
   * @param metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  private _updateMetaAttributes(metaManager: MetaManager) {
    this._window.setTitle(metaManager.getTitle());

    this._updateMetaTagsOfType(
      'meta',
      'name',
      metaManager
        .getMetaNames()
        .reduce(
          (prev, curr) => ({ ...prev, [curr]: metaManager.getMetaName(curr) }),
          {}
        )
    );

    this._updateMetaTagsOfType(
      'meta',
      'property',
      metaManager.getMetaProperties().reduce(
        (prev, curr) => ({
          ...prev,
          [curr]: metaManager.getMetaProperty(curr),
        }),
        {}
      )
    );
    this._updateMetaTagsOfType(
      'link',
      'rel',
      metaManager
        .getLinks()
        .reduce(
          (prev, curr) => ({ ...prev, [curr]: metaManager.getLink(curr) }),
          {}
        )
    );
  }
}
/* @endif */
