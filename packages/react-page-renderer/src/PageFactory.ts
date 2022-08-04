import { Controller, ControllerDecorator, GenericError, ObjectContainer } from '@ima/core';
import { ComponentType } from 'react';
import PageStateManager from './state/PageStateManager';
import PageStateManagerDecorator from './state/PageStateManagerDecorator';

/**
 * Factory for page.
 */
export default class PageFactory {
  private _oc: ObjectContainer;

  /**
   * Factory used by page management classes.
   */
  constructor(oc: ObjectContainer) {
    /**
     * The current application object container.
     */
    this._oc = oc;
  }

  /**
   * Create new instance of {@linkcode Controller}.
   */
  createController(controller: string | Controller): Controller {
    let controllerInstance = this._oc.create(controller, []);

    return controllerInstance as Controller;
  }

  /**
   * Retrieves the specified react component class.
   *
   * @param view The namespace
   *        referring to a react component class, or a react component class
   *        constructor.
   * @return The react component class constructor.
   */
  createView(view: string | ComponentType) {
    if (typeof view === 'function') {
      return view;
    }
    const classConstructor = this._oc.getConstructorOf(view);

    if (classConstructor) {
      return classConstructor;
    } else {
      throw new GenericError(
        `ima.core.page.Factory:createView hasn't name of view "${view}".`
      );
    }
  }

  /**
   * Returns decorated controller for ease setting seo params in controller.
   */
  decorateController(controller: Controller): ControllerDecorator {
    const metaManager = this._oc.get('$MetaManager');
    const router = this._oc.get('$Router');
    const dictionary = this._oc.get('$Dictionary');
    const settings = this._oc.get('$Settings');

    const decoratedController = this._oc.create('$ControllerDecorator', [
      controller,
      metaManager,
      router,
      dictionary,
      settings,
    ]);

    return decoratedController as ControllerDecorator;
  }

  /**
   * Returns decorated page state manager for extension.
   */
  decoratePageStateManager(pageStateManager: PageStateManager, allowedStateKeys: string[]): PageStateManagerDecorator {
    const decoratedPageStateManager = this._oc.create(
      '$PageStateManagerDecorator',
      [pageStateManager, allowedStateKeys]
    );

    return decoratedPageStateManager as PageStateManagerDecorator;
  }
}
