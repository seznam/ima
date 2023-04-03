import { AbstractConstructor, Constructor } from 'type-fest';

import { PageStateManager } from './state/PageStateManager';
import { OCAliasMap } from '../config/bind';
import { Controller } from '../controller/Controller';
import { GenericError } from '../error/GenericError';
import { Extension } from '../extension/Extension';
import { ObjectContainer } from '../oc/ObjectContainer';
import { RouteOptions } from '../router/Router';

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
  createController(
    controller:
      | keyof OCAliasMap
      | Constructor<Controller>
      | AbstractConstructor<Controller>,
    options: RouteOptions
  ): Controller {
    const { extensions = [] } = options;
    let mergedExtensions = [...extensions];

    if (
      typeof controller !== 'string' &&
      controller instanceof Controller &&
      Array.isArray(controller?.$extensions) &&
      controller.$extensions.length
    ) {
      mergedExtensions = mergedExtensions.concat(controller.$extensions);
    }

    const controllerInstance = this._oc.create(controller) as Controller;

    for (const extension of mergedExtensions) {
      const loadedExtension = this._oc.get(extension) as Extension;

      // Optional extension handling
      if (!loadedExtension) {
        continue;
      }

      // Spread support handling
      if (Array.isArray(loadedExtension)) {
        for (const extensionInstance of loadedExtension) {
          controllerInstance.addExtension(
            extensionInstance.constructor,
            extensionInstance
          );
        }
      } else {
        controllerInstance.addExtension(
          extension as typeof Extension,
          loadedExtension
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
  createView<
    V extends keyof OCAliasMap | Constructor<any> | ((...args: any[]) => any)
  >(view: V) {
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
  decorateController(controller: Controller) {
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

    return decoratedController;
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

    return decoratedPageStateManager;
  }
}
