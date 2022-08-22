import {
  Controller,
  Dispatcher,
  PageRenderer,
  RendererEvents,
} from '@ima/core';
import { ComponentType, Component } from 'react';

import BlankManagedRootView from './BlankManagedRootView';
import PageRendererFactory from './PageRendererFactory';
import {
  AnyResource,
  AnyState,
  Helpers,
  RouteOptions,
  Settings,
} from './types';
import ViewAdapter from './ViewAdapter';

/**
 * Base class for implementations of the {@linkcode PageRenderer} interface.
 */
export default abstract class AbstractPageRenderer extends PageRenderer {
  protected _factory: PageRendererFactory;
  // TODO import * as $Helper from '@ima/helpers'; (not a type)
  protected _helpers: Helpers;
  protected _dispatcher: Dispatcher;
  protected _settings: Settings;
  protected _reactiveView?: Component | Element | void;

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
    pageResources: AnyResource,
    routeOptions: RouteOptions
  ): Promise<{
    content?: string;
    pageState: AnyState;
    status: number;
  }>;

  /**
   * @inheritdoc
   */
  abstract update(
    controller: Controller,
    view: ComponentType,
    pageResources: AnyResource,
    routeOptions: RouteOptions
  ): Promise<{
    content?: string;
    pageState: AnyState;
    status: number;
  }>;

  /**
   * @inheritdoc
   */
  abstract unmount(): void;

  /**
   * @inheritdoc
   */
  setState(state = {}) {
    if (this._reactiveView instanceof Component) {
      // add temp indicator (in viewAdapter method getDerivedStateFromProps is unset) for indicate whether not to use state in props
      const stateWithIndicator = Object.assign({}, state, {
        notUsePropsState: true,
      });
      this._reactiveView.setState(stateWithIndicator, () => {
        this._dispatcher.fire(RendererEvents.UPDATED, { state }, true);
      });
    }
  }

  /**
   * Generate properties for view from state.
   *
   * @param view The page view React component to wrap.
   * @param state
   */
  protected _generateViewProps(
    view: ComponentType,
    state: AnyState = {}
  ): AnyState {
    const props = {
      view,
      state,
      $Utils: this._factory.getUtils(),
    };

    return props;
  }

  /**
   * Returns wrapped page view component with managed root view and view adapter.
   *
   * @param routeOptions The current route options.
   */
  protected _getWrappedPageView(
    controller: Controller,
    view: ComponentType,
    routeOptions: RouteOptions
  ) {
    const managedRootView = this._factory.getManagedRootView(
      routeOptions.managedRootView ||
        this._settings.$Page.$Render.managedRootView ||
        BlankManagedRootView
    );
    const props = this._generateViewProps(
      managedRootView,
      Object.assign({}, controller.getState(), { $pageView: view })
    );

    return this._factory.wrapView(
      routeOptions.viewAdapter ||
        this._settings.$Page.$Render.viewAdapter ||
        ViewAdapter,
      props
    );
  }

  /**
   * Returns the class constructor of the specified document view component.
   *
   * @param routeOptions The current route options.
   * @return The constructor of the document view component.
   */
  protected _getDocumentView(routeOptions: RouteOptions) {
    return this._factory.getDocumentView(
      routeOptions.documentView || this._settings.$Page.$Render.documentView
    );
  }
}
