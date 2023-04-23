import {
  Controller,
  Dispatcher,
  MetaManager,
  PageRenderer,
  type Utils,
  type UnknownParameters,
  type UnknownPromiseParameters,
  type PageData as BasePageData,
  type RouteOptions,
  type Settings,
} from '@ima/core';
import * as Helpers from '@ima/helpers';
import { ComponentType, createElement, ReactElement } from 'react';
import * as react from 'react';
import * as reactDOM from 'react-dom/server';

import { PageRendererFactory } from './PageRendererFactory';
import { BlankManagedRootView } from '../component/BlankManagedRootView';
import { ViewAdapter, ViewAdapterProps } from '../component/ViewAdapter';

export type PageData = {
  documentView?: ComponentType;
  documentViewProps?: {
    $Utils: Utils;
    metaManager: MetaManager;
  };
  react?: typeof react;
  reactDOM?: typeof reactDOM;
  viewAdapter?: ReactElement;
} & BasePageData;

/**
 * Base class for implementations of the {@linkcode PageRenderer} interface.
 */
export abstract class AbstractPageRenderer extends PageRenderer {
  protected _dispatcher: Dispatcher;
  protected _factory: PageRendererFactory;
  protected _helpers: typeof Helpers;
  protected _settings: Settings;
  protected _viewAdapter?: ComponentType;
  protected _viewAdapterProps: UnknownParameters = {};

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
    helpers: typeof Helpers,
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
   * @inheritDoc
   */
  abstract mount(
    controller: Controller,
    pageView: ComponentType,
    pageResources: UnknownPromiseParameters,
    routeOptions: RouteOptions
  ): Promise<void | PageData>;

  /**
   * @inheritDoc
   */
  abstract update(
    controller: Controller,
    pageView: ComponentType,
    pageResources: UnknownPromiseParameters
  ): Promise<void | PageData>;

  /**
   * @inheritDoc
   */
  abstract unmount(): void;

  /**
   * @inheritDoc
   */
  abstract setState(pageState: UnknownParameters): Promise<void>;

  /**
   * @inheritDoc
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
    state: UnknownParameters = {}
  ): ViewAdapterProps {
    const props = {
      $Utils: this._factory.getUtils(),
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
