import { AbstractConstructor, Constructor } from 'type-fest';

import { Controller, CreateLoadedResources } from './Controller';
import { Settings } from '../boot';
import { OCAliasMap } from '../config/bind';
import { Dictionary } from '../dictionary/Dictionary';
import { Extension } from '../extension/Extension';
import { MetaManager } from '../meta/MetaManager';
import { PageState, PageStateManager } from '../page/state/PageStateManager';
import { RouteParams } from '../router/AbstractRoute';
import { Router } from '../router/Router';

/**
 * Decorator for page controllers. The decorator manages references to the meta
 * attributes manager and other utilities so these can be easily provided to
 * the decorated page controller when needed.
 */
export class ControllerDecorator<
  S extends PageState = {},
  R extends RouteParams = {}
> extends Controller<S, R> {
  /**
   * The controller being decorated.
   */
  protected _controller: Controller<S, R>;
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
    controller: Controller<S, R>,
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
  load(): Promise<S> | S {
    return this._controller.load();
  }

  /**
   * @inheritDoc
   */
  update(prevParams: R = {} as R): Promise<S> | S {
    return this._controller.update(prevParams);
  }

  /**
   * @inheritDoc
   */
  setState<K extends keyof S>(statePatch: Pick<S, K> | S | null): void {
    this._controller.setState(statePatch);
  }

  /**
   * @inheritDoc
   */
  getState(): S {
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
      | Constructor<Extension<any, any>>
      | AbstractConstructor<Extension<any, any>>
      | InstanceType<typeof Extension>,
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
  setMetaParams(loadedResources: CreateLoadedResources<S>) {
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
  setRouteParams(params: R = {} as R): void {
    this._controller.setRouteParams(params);
  }

  /**
   * @inheritDoc
   */
  getRouteParams(): R {
    return this._controller.getRouteParams();
  }

  /**
   * @inheritDoc
   */
  setPageStateManager(pageStateManager?: PageStateManager<S>): void {
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
