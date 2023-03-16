import ObjectContainer, { UnknownConstructable } from '../ObjectContainer';
import GenericError from '../error/GenericError';
import AbstractController from '../controller/AbstractController';
import { IController } from '../controller/Controller';
import Router, { RouteOptions } from '../router/Router';
import Extension from '../extension/Extension';
import PageStateManager from './state/PageStateManager';
import ControllerDecorator from '../controller/ControllerDecorator';
import MetaManager from '../meta/MetaManager';
import Dictionary from '../dictionary/Dictionary';
import PageStateManagerDecorator from './state/PageStateManagerDecorator';
import { UnknownParameters } from '../CommonTypes';

/**
 * Factory for page.
 */
export default class PageFactory {
  /**
   * The current application object container.
   */
  _oc: ObjectContainer;

  /**
   * Factory used by page management classes.
   */
  constructor(oc: ObjectContainer) {
    this._oc = oc;
  }

  /**
   * Create new instance of {@link Controller}.
   */
  createController(
    controller: string | IController,
    options: RouteOptions = {}
  ) {
    const { extensions = [] } = options;
    let mergedExtensions = [...extensions];
    if (
      Array.isArray((controller as typeof AbstractController)?.$extensions) &&
      (controller as typeof AbstractController).$extensions.length
    ) {
      mergedExtensions = mergedExtensions.concat(
        (controller as typeof AbstractController).$extensions
      );
    }

    const controllerInstance = this._oc.create(
      controller as typeof AbstractController
    ) as AbstractController;

    for (const extension of mergedExtensions) {
      const loadedExtension = this._oc.get(extension as typeof Extension);

      // Optional extension handling
      if (!loadedExtension) {
        continue;
      }

      // Spread support handling
      if (Array.isArray(loadedExtension)) {
        for (const extensionInstance of loadedExtension) {
          (controllerInstance as AbstractController).addExtension(
            extensionInstance?.constructor,
            extensionInstance
          );
        }
      } else {
        (controllerInstance as AbstractController).addExtension(
          extension as typeof Extension,
          loadedExtension as Extension
        );
      }
    }

    return controllerInstance;
  }

  /**
   * Retrieves the specified react component class.
   *
   * @param view The namespace
   *        referring to a react component class, or a react component class
   *        constructor.
   * @return The react component class
   *         constructor.
   */
  createView(view: unknown) {
    if (typeof view === 'function') {
      return view;
    }
    const classConstructor = this._oc.getConstructorOf(
      view as UnknownConstructable
    );

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
  decorateController(controller: IController) {
    const metaManager = this._oc.get('$MetaManager') as MetaManager;
    const router = this._oc.get('$Router') as Router;
    const dictionary = this._oc.get('$Dictionary') as Dictionary;
    const settings = this._oc.get('$Settings') as UnknownParameters;

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
  decoratePageStateManager(
    pageStateManager: PageStateManager,
    allowedStateKeys: string[]
  ) {
    const decoratedPageStateManager = this._oc.create(
      '$PageStateManagerDecorator',
      [pageStateManager, allowedStateKeys]
    );

    return decoratedPageStateManager as PageStateManagerDecorator;
  }
}
