import { ComponentUtils } from '@ima/core';
import { Component, ComponentType, PureComponent } from 'react';

/**
 * Factory for page render.
 */
export class PageRendererFactory {
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
  getDocumentView(documentView: ComponentType) {
    if ($Debug) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const componentPrototype = documentView.prototype;

      if (
        !(
          componentPrototype instanceof PureComponent ||
          this._isFunctionalComponent(documentView)
        )
      ) {
        throw new Error(
          'The document view component must extend React.PureComponent or be a functional component.'
        );
      }
    }

    return documentView;
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
  getManagedRootView(managedRootView: ComponentType) {
    if ($Debug) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const componentPrototype = managedRootView.prototype;

      if (
        !(
          componentPrototype instanceof Component ||
          this._isFunctionalComponent(managedRootView)
        )
      ) {
        throw new Error(
          'The managed root view component must extend React.Component or be a functional component.'
        );
      }
    }

    return managedRootView;
  }

  private _isFunctionalComponent(component: unknown) {
    return (
      typeof component === 'function' &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      !(component.prototype && component.prototype.isReactComponent)
    );
  }
}
