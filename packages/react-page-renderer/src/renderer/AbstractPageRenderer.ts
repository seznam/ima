import { ComponentType, Component } from 'react';
import { Controller, Dispatcher, GenericError } from '@ima/core';

import BlankManagedRootView from './BlankManagedRootView';
import PageRendererFactory from './PageRendererFactory';
import PageRendererInterface from './PageRendererInterface';
import RendererEvents from '../renderer/RendererEvents';
import RouteOptions from '../manager/RouteOptions';
import ViewAdapter from './ViewAdapter';

// TODO import * as $Helper from '@ima/helpers'; (not a type)
// TODO 

/**
 * Base class for implementations of the {@linkcode PageRendererInterface} interface.
 */
export default abstract class AbstractPageRenderer implements PageRendererInterface {
  protected _factory: PageRendererFactory;
  protected _helpers: { [key: string]: Function };
  protected _dispatcher: Dispatcher;
  protected _settings: { [key: string]: any };
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
  constructor(factory: PageRendererFactory, helpers: { [key: string]: Function }, dispatcher: Dispatcher, settings: { [key: string]: any }) {
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
  mount(controller: Controller, view: ComponentType, pageResources: { [key: string]: any | Promise<any> }, routeOptions: RouteOptions): Promise<{ content?: string; pageState: { [key: string]: any }; status: number; }> {
    throw new GenericError(
      'The mount() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  update(controller: Controller, view: ComponentType, pageResources: { [key: string]: any | Promise<any> }, routeOptions: RouteOptions): Promise<{ content?: string; pageState: { [key: string]: any }; status: number; }> {
    throw new GenericError(
      'The update() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  unmount() {
    throw new GenericError(
      'The unmount() method is abstract and must be overridden.'
    );
  }

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
  protected _generateViewProps(view: ComponentType, state: { [key: string]: any } = {}): { [key: string]: any } {
    let props = {
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
  protected _getWrappedPageView(controller: Controller, view: ComponentType, routeOptions: RouteOptions) {
    let managedRootView = this._factory.getManagedRootView(
      routeOptions.managedRootView ||
      this._settings.$Page.$Render.managedRootView ||
      BlankManagedRootView
    );
    let props = this._generateViewProps(
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
