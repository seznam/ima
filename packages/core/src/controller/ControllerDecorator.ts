import Controller from './Controller';
import MetaManager from '../meta/MetaManager';
import Router from '../router/Router';
import Dictionary from '../dictionary/Dictionary';
import Extension, { IExtension } from '../extension/Extension';
import PageStateManager from '../page/state/PageStateManager';
import { UnknownParameters } from '../CommonTypes';

/**
 * Decorator for page controllers. The decorator manages references to the meta
 * attributes manager and other utilities so these can be easily provided to
 * the decorated page controller when needed.
 */
export default class ControllerDecorator extends Controller {
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
   * @param {Controller} controller The controller being decorated.
   * @param {MetaManager} metaManager The meta page attributes manager.
   * @param {Router} router The application router.
   * @param {Dictionary} dictionary Localization phrases dictionary.
   * @param {Object<string, *>} settings  Application settings for the
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
   * @inheritdoc
   */
  init() {
    this._controller.init();
  }

  /**
   * @inheritdoc
   */
  destroy() {
    this._controller.destroy();
  }

  /**
   * @inheritdoc
   */
  activate() {
    this._controller.activate();
  }

  /**
   * @inheritdoc
   */
  deactivate() {
    this._controller.deactivate();
  }

  /**
   * @inheritdoc
   */
  load() {
    return this._controller.load();
  }

  /**
   * @inheritdoc
   */
  update(params = {}) {
    return this._controller.update(params);
  }

  /**
   * @inheritdoc
   */
  setState(statePatch: UnknownParameters) {
    this._controller.setState(statePatch);
  }

  /**
   * @inheritdoc
   */
  getState() {
    return this._controller.getState();
  }

  /**
   * @inheritdoc
   */
  beginStateTransaction() {
    this._controller.beginStateTransaction();
  }

  /**
   * @inheritdoc
   */
  commitStateTransaction() {
    this._controller.commitStateTransaction();
  }

  /**
   * @inheritdoc
   */
  cancelStateTransaction() {
    this._controller.cancelStateTransaction();
  }

  /**
   * @inheritdoc
   */
  addExtension(
    extension: Extension | IExtension,
    extensionInstance?: Extension
  ) {
    this._controller.addExtension(extension, extensionInstance);

    return this;
  }

  /**
   * @inheritdoc
   */
  getExtensions() {
    return this._controller.getExtensions();
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
   */
  setRouteParams(params = {}) {
    this._controller.setRouteParams(params);
  }

  /**
   * @inheritdoc
   */
  getRouteParams() {
    return this._controller.getRouteParams();
  }

  /**
   * @inheritdoc
   */
  setPageStateManager(pageStateManager: PageStateManager) {
    this._controller.setPageStateManager(pageStateManager);
  }

  /**
   * @inheritdoc
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
