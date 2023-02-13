import { Controller } from './Controller';
import { Dictionary } from '../dictionary/Dictionary';
import { Extension, IExtension } from '../extension/Extension';
import { MetaManager } from '../meta/MetaManager';
import { PageStateManager } from '../page/state/PageStateManager';
import { Router } from '../router/Router';
import { UnknownParameters } from '../types';

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
  protected _settings: UnknownParameters;

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
    settings: UnknownParameters
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
  init() {
    this._controller.init();
  }

  /**
   * @inheritDoc
   */
  destroy() {
    this._controller.destroy();
  }

  /**
   * @inheritDoc
   */
  activate() {
    this._controller.activate();
  }

  /**
   * @inheritDoc
   */
  deactivate() {
    this._controller.deactivate();
  }

  /**
   * @inheritDoc
   */
  load() {
    return this._controller.load();
  }

  /**
   * @inheritDoc
   */
  update(params = {}) {
    return this._controller.update(params);
  }

  /**
   * @inheritDoc
   */
  setState(statePatch: UnknownParameters) {
    this._controller.setState(statePatch);
  }

  /**
   * @inheritDoc
   */
  getState() {
    return this._controller.getState();
  }

  /**
   * @inheritDoc
   */
  beginStateTransaction() {
    this._controller.beginStateTransaction();
  }

  /**
   * @inheritDoc
   */
  commitStateTransaction() {
    this._controller.commitStateTransaction();
  }

  /**
   * @inheritDoc
   */
  cancelStateTransaction() {
    this._controller.cancelStateTransaction();
  }

  /**
   * @inheritDoc
   */
  addExtension(
    extension: Extension | IExtension,
    extensionInstance?: Extension
  ) {
    this._controller.addExtension(extension, extensionInstance);

    return this;
  }

  /**
   * @inheritDoc
   */
  getExtensions() {
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
  setRouteParams(params = {}) {
    this._controller.setRouteParams(params);
  }

  /**
   * @inheritDoc
   */
  getRouteParams() {
    return this._controller.getRouteParams();
  }

  /**
   * @inheritDoc
   */
  setPageStateManager(pageStateManager: PageStateManager) {
    this._controller.setPageStateManager(pageStateManager);
  }

  /**
   * @inheritDoc
   */
  getHttpStatus() {
    return this._controller.getHttpStatus();
  }

  /**
   * Returns the meta attributes manager configured by the decorated
   * controller.
   *
   * @return The Meta attributes manager configured by the
   *         decorated controller.
   */
  getMetaManager() {
    return this._metaManager;
  }
}
