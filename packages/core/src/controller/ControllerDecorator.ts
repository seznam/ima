import { AbstractConstructor, Constructor } from 'type-fest';

import { Controller } from './Controller';
import { OCAliasMap, RouteParams, Settings } from '..';
import { Dictionary } from '../dictionary/Dictionary';
import { Extension } from '../extension/Extension';
import { MetaManager } from '../meta/MetaManager';
import { PageStateManager } from '../page/state/PageStateManager';
import { Router } from '../router/Router';
import { UnknownParameters, UnknownPromiseParameters } from '../types';

/**
 * Decorator for page controllers. The decorator manages references to the meta
 * attributes manager and other utilities so these can be easily provided to
 * the decorated page controller when needed.
 */
export class ControllerDecorator extends Controller {
  /**
   * The controller being decorated.
   */
  protected _controller: Controller;
  /**
   * The meta page attributes manager.
   */
  protected _metaManager: MetaManager;
  /**
   * The application router.
   */
  protected _router: Router;
  /**
   * Localization phrases dictionary.
   */
  protected _dictionary: Dictionary;
  /**
   * Application settings for the current application environment.
   */
  protected _settings: Settings;

  /**
   * Initializes the controller decorator.
   *
   * @param controller The controller being decorated.
   * @param metaManager The meta page attributes manager.
   * @param router The application router.
   * @param dictionary Localization phrases dictionary.
   * @param settings  Application settings for the
   *        current application environment.
   */
  constructor(
    controller: Controller,
    metaManager: MetaManager,
    router: Router,
    dictionary: Dictionary,
    settings: Settings
  ) {
    super();

    this._controller = controller;
    this._metaManager = metaManager;
    this._router = router;
    this._dictionary = dictionary;
    this._settings = settings;
  }

  /**
   * @inheritDoc
   */
  init(): Promise<void> | void {
    this._controller.init();
  }

  /**
   * @inheritDoc
   */
  destroy(): Promise<void> | void {
    this._controller.destroy();
  }

  /**
   * @inheritDoc
   */
  activate(): Promise<void> | void {
    this._controller.activate();
  }

  /**
   * @inheritDoc
   */
  deactivate(): Promise<void> | void {
    this._controller.deactivate();
  }

  /**
   * @inheritDoc
   */
  load(): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    return this._controller.load();
  }

  /**
   * @inheritDoc
   */
  update(
    prevParams: RouteParams = {}
  ): Promise<UnknownPromiseParameters> | UnknownPromiseParameters {
    return this._controller.update(prevParams);
  }

  /**
   * @inheritDoc
   */
  setState(statePatch: UnknownParameters): void {
    this._controller.setState(statePatch);
  }

  /**
   * @inheritDoc
   */
  getState(): UnknownParameters {
    return this._controller.getState();
  }

  /**
   * @inheritDoc
   */
  beginStateTransaction(): void {
    this._controller.beginStateTransaction();
  }

  /**
   * @inheritDoc
   */
  commitStateTransaction(): void {
    this._controller.commitStateTransaction();
  }

  /**
   * @inheritDoc
   */
  cancelStateTransaction(): void {
    this._controller.cancelStateTransaction();
  }

  /**
   * @inheritDoc
   */
  addExtension(
    extension:
      | keyof OCAliasMap
      | Constructor<Extension>
      | AbstractConstructor<Extension>,
    extensionInstance?: InstanceType<typeof Extension>
  ): void {
    this._controller.addExtension(extension, extensionInstance);
  }

  /**
   * @inheritDoc
   */
  getExtension(
    extension: typeof Extension
  ): InstanceType<typeof Extension> | undefined {
    return this._controller.get(extension);
  }

  /**
   * @inheritDoc
   */
  getExtensions(): Extension[] {
    return this._controller.getExtensions();
  }

  /**
   * @inheritDoc
   */
  setMetaParams(loadedResources: UnknownParameters) {
    this._controller.setMetaParams(
      loadedResources,
      this._metaManager,
      this._router,
      this._dictionary,
      this._settings
    );
  }

  /**
   * @inheritDoc
   */
  setRouteParams(params: RouteParams = {}): void {
    this._controller.setRouteParams(params);
  }

  /**
   * @inheritDoc
   */
  getRouteParams(): RouteParams {
    return this._controller.getRouteParams();
  }

  /**
   * @inheritDoc
   */
  setPageStateManager(pageStateManager: PageStateManager): void {
    this._controller.setPageStateManager(pageStateManager);
  }

  /**
   * @inheritDoc
   */
  getHttpStatus(): number {
    return this._controller.getHttpStatus();
  }

  /**
   * Returns the meta attributes manager configured by the decorated
   * controller.
   *
   * @return The Meta attributes manager configured by the
   *         decorated controller.
   */
  getMetaManager(): MetaManager {
    return this._metaManager;
  }
}
