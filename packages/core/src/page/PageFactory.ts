import { PageStateManager } from './state/PageStateManager';
import { PageStateManagerDecorator } from './state/PageStateManagerDecorator';
import { Controller } from '../controller/Controller';
import { ControllerDecorator } from '../controller/ControllerDecorator';
import { Dictionary } from '../dictionary/Dictionary';
import { GenericError } from '../error/GenericError';
import { Extension } from '../extension/Extension';
import { MetaManager } from '../meta/MetaManager';
import {
  Dependency,
  ObjectContainer,
  UnknownConstructable,
} from '../ObjectContainer';
import { Router, RouteOptions } from '../router/Router';
import { UnknownParameters } from '../types';

/**
 * Factory for page.
 */
export class PageFactory {
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
  createController(controller: string | Controller, options: RouteOptions) {
    const { extensions = [] } = options;
    let mergedExtensions = [...extensions];
    if (
      controller instanceof Controller &&
      Array.isArray(controller?.$extensions) &&
      controller.$extensions.length
    ) {
      mergedExtensions = mergedExtensions.concat(controller.$extensions);
    }

    const controllerInstance = this._oc.create(
      controller as unknown as Dependency
    ) as Controller;

    for (const extension of mergedExtensions) {
      const loadedExtension = this._oc.get(
        extension as unknown as Dependency
      ) as Extension;

      // Optional extension handling
      if (!loadedExtension) {
        continue;
      }

      if (Array.isArray(loadedExtension)) {
        // Spread support handling
        for (const extensionInstance of loadedExtension) {
          controllerInstance.addExtension(
            extensionInstance.constructor,
            extensionInstance
          );
        }
      } else {
        controllerInstance.addExtension(extension, loadedExtension);
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
  decorateController(controller: Controller) {
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
