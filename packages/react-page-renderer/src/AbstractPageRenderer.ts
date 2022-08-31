import { Controller, Dispatcher, PageRenderer } from '@ima/core';
import { ComponentType, createElement } from 'react';

import BlankManagedRootView, {
  ManagedRootViewProps,
} from './BlankManagedRootView';
import PageRendererFactory from './PageRendererFactory';
import { Helpers, RouteOptions, Settings } from './types';
import ViewAdapter from './ViewAdapter';

/**
 * Base class for implementations of the {@linkcode PageRenderer} interface.
 */
export default abstract class AbstractPageRenderer extends PageRenderer {
  protected _dispatcher: Dispatcher;
  protected _factory: PageRendererFactory;
  protected _helpers: Helpers;
  protected _settings: Settings;
  protected _viewAdapter?: ComponentType;
  protected _viewAdapterProps = {};

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
    view: ComponentType,
    pageResources: { [key: string]: unknown | Promise<unknown> },
    routeOptions: RouteOptions
  ): Promise<
    | unknown
    | {
        content?: string;
        pageState: { [key: string]: unknown };
        status: number;
      }
  >;

  /**
   * @inheritdoc
   */
  abstract update(
    controller: Controller,
    view: ComponentType,
    pageResources: { [key: string]: unknown | Promise<unknown> },
    routeOptions: RouteOptions
  ): Promise<
    | unknown
    | {
        content?: string;
        pageState: { [key: string]: unknown };
        status: number;
      }
  >;

  /**
   * @inheritdoc
   */
  abstract unmount(): void;

  /**
   * @inheritdoc
   */
  abstract render(props: unknown): void;

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
   * @param state
   */
  protected _generateViewAdapterProps(
    view: ComponentType,
    pageView: ComponentType,
    state: { [key: string]: unknown } = {}
  ): ManagedRootViewProps {
    const props = {
      $Utils: this._factory.getUtils(),
      pageView,
      state,
      view,
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
    view: ComponentType,
    routeOptions: RouteOptions
  ) {
    const managedRootView = this._factory.getManagedRootView(
      (routeOptions.managedRootView ||
        this._settings.$Page.$Render.managedRootView ||
        BlankManagedRootView) as ComponentType
    );
    const props = this._generateViewAdapterProps(
      managedRootView,
      view,
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
