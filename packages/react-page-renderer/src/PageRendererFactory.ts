import { Component, ComponentType, createElement, PureComponent } from 'react';

import { ComponentUtils } from '@ima/core';

/**
 * Factory for page render.
 */
export default class PageRendererFactory {
  private _componentUtils: ComponentUtils;

  /**
   * Initializes the factory used by the page renderer.
   *
   * @param componentUtils The registry of component utilities.
   */
  constructor(componentUtils: ComponentUtils) {
    /**
     * The registry of component utilities.
     */
    this._componentUtils = componentUtils;
  }

  /**
   * Return object of services which are defined for alias $Utils.
   */
  getUtils() {
    return this._componentUtils.getUtils();
  }

  /**
   * Returns the class constructor of the specified document view component.
   * Document view may be specified as a namespace path or as a class
   * constructor.
   *
   * @param documentView The
   *        namespace path pointing to the document view component, or the
   *        constructor of the document view component.
   * @return The constructor of the document
   *         view component.
   */
  getDocumentView(documentView: ComponentType | string) {
    let documentViewComponent = this._resolveClassConstructor(documentView);

    if ($Debug) {
      let componentPrototype = documentViewComponent.prototype;

      if (!(componentPrototype instanceof PureComponent || this._isFunctionalComponent(documentViewComponent))) {
        throw new Error(
          'The document view component must extend React.PureComponent or be a functional component.'
        );
      }
    }

    return documentViewComponent;
  }

  /**
   * Returns the class constructor of the specified managed root view
   * component. Managed root view may be specified as a namespace
   * path or as a class constructor.
   *
   * @param managedRootView The
   *        namespace path pointing to the managed root view component, or
   *        the constructor of the React component.
   * @return The constructor of the managed
   *         root view component.
   */
  getManagedRootView(managedRootView: ComponentType | string) {
    let managedRootViewComponent =
      this._resolveClassConstructor(managedRootView);

    if ($Debug) {
      let componentPrototype = managedRootViewComponent.prototype;

      if (!(componentPrototype instanceof Component || this._isFunctionalComponent(componentPrototype))) {
        throw new Error(
          'The managed root view component must extend React.Component or be a functional component.'
        );
      }
    }

    return managedRootViewComponent;
  }

  /**
   * Wraps the provided view into the view adapter so it can access the state
   * passed from controller through the {@code props} property instead of the
   * {@code state} property.
   *
   * @param view The namespace path
   *        pointing to the view component, or the constructor
   *        of the {@code React.Component}.
   * @param props The initial props to pass to the view.
   * @return View adapter handling passing the controller's
   *         state to an instance of the specified page view through
   *         properties.
   */
  // TODO props any?
  wrapView(view: ComponentType | string, props: { [key: string]: any }) {
    return createElement(
      this._resolveClassConstructor(view),
      props
    );
  }

  /**
   * Return a function that produces ReactElements of a given type.
   * Like React.createElement.
   *
   * @param view The react
   *        component for which a factory function should be created.
   * @return The created factory
   *         function. The factory accepts an object containing the
   *         component's properties as the argument and returns a rendered
   *         component.
   */
  createReactElementFactory(view: ComponentType<any> | string) {
    return createElement.bind(null, view);
  }

  /**
   * Returns the class constructor of the specified view component.
   * View may be specified as a namespace path or as a class
   * constructor.
   *
   * @param view The namespace path
   *        pointing to the view component, or the constructor
   *        of the {@code React.Component}.
   * @return The constructor of the view
   *         component.
   */
  private _resolveClassConstructor(view: ComponentType | string): ComponentType {
    if ($Debug && typeof view === 'string') {
      throw new Error(
        `The namespace was removed. You must pass react component instead of namespace ${view}.`
      );
    }

    return view as ComponentType;
  }

  private _isFunctionalComponent(component: Object) {
    return typeof component === 'function' && !(component.prototype && component.prototype.isReactComponent);
  }
}
