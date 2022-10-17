import { Controller, Dispatcher, PageRenderer } from '@ima/core';
import { RouteOptions } from '@ima/core/dist/cjs/router/Router';
import { ComponentType, createElement } from 'react';

import BlankManagedRootView from './BlankManagedRootView';
import PageRendererFactory from './PageRendererFactory';
import { Helpers, Settings, Utils } from './types';
import ViewAdapter, { ViewAdapterProps } from './ViewAdapter';

/**
 * Base class for implementations of the {@linkcode PageRenderer} interface.
 */
export default abstract class AbstractPageRenderer extends PageRenderer {
  protected _dispatcher: Dispatcher;
  protected _factory: PageRendererFactory;
  protected _helpers: Helpers;
  protected _settings: Settings;
  protected _viewAdapter?: ComponentType;
  protected _viewAdapterProps: { [key: string]: unknown } = {};

  /**
   * Initializes the abstract page renderer.
   *
   * @param factory Factory for receive $Utils to view.
   * @param helpers The IMA.js helper methods.
   *        to render the page.
   * @param dispatcher Dispatcher fires events to app.
   * @param settings Application settings for the current
   *        application environment.
   */
  constructor(
    factory: PageRendererFactory,
    helpers: Helpers,
    dispatcher: Dispatcher,
    settings: Settings
  ) {
    super();

    /**
     * Factory for receive $Utils to view.
     */
    this._factory = factory;

    /**
     * The IMA.js helper methods.
     */
    this._helpers = helpers;

    /**
     * Dispatcher fires events to app.
     */
    this._dispatcher = dispatcher;

    /**
     * Application setting for the current application environment.
     */
    this._settings = settings;
  }

  /**
   * @inheritdoc
   */
  abstract mount(
    controller: Controller,
    pageView: ComponentType,
    pageResources: { [key: string]: unknown | Promise<unknown> },
    routeOptions: RouteOptions
  ): Promise<void | {
    content?: string;
    pageState?: { [key: string]: unknown };
    status: number;
  }>;

  /**
   * @inheritdoc
   */
  abstract update(
    controller: Controller,
    pageView: ComponentType,
    pageResources: { [key: string]: unknown | Promise<unknown> }
  ): Promise<void | {
    content?: string;
    pageState: { [key: string]: unknown };
    status: number;
  }>;

  /**
   * @inheritdoc
   */
  abstract unmount(): void;

  /**
   * @inheritdoc
   */
  abstract setState(pageState: unknown): void;

  /**
   * @inheritdoc
   */
  _getViewAdapterElement(props = {}) {
    if (this._viewAdapter) {
      this._viewAdapterProps = Object.assign(this._viewAdapterProps, props);

      return createElement(this._viewAdapter, this._viewAdapterProps);
    }
  }

  /**
   * Generate properties for view from state.
   *
   * @param view The page view React component to wrap.
   */
  protected _generateViewAdapterProps(
    managedRootView: ComponentType,
    pageView: ComponentType,
    state: { [key: string]: unknown } = {}
  ): ViewAdapterProps {
    const props = {
      $Utils: this._factory.getUtils() as Utils,
      managedRootView,
      pageView,
      state,
    };

    return props;
  }

  /**
   * Returns wrapped page view component with managed root view and view adapter.
   *
   * @param routeOptions The current route options.
   */
  protected _prepareViewAdapter(
    controller: Controller,
    pageView: ComponentType,
    routeOptions: RouteOptions
  ) {
    const managedRootView = this._factory.getManagedRootView(
      (routeOptions.managedRootView ||
        this._settings.$Page.$Render.managedRootView ||
        BlankManagedRootView) as ComponentType
    );
    const props = this._generateViewAdapterProps(
      managedRootView,
      pageView,
      Object.assign({}, controller.getState())
    );

    this._viewAdapter = (routeOptions.viewAdapter ||
      this._settings.$Page.$Render.viewAdapter ||
      ViewAdapter) as ComponentType;
    this._viewAdapterProps = Object.assign(this._viewAdapterProps, props);
  }

  /**
   * Returns the class constructor of the specified document view component.
   *
   * @param routeOptions The current route options.
   * @return The constructor of the document view component.
   */
  protected _getDocumentView(routeOptions: RouteOptions) {
    return this._factory.getDocumentView(
      (routeOptions.documentView ||
        this._settings.$Page.$Render.documentView) as ComponentType
    );
  }
}
