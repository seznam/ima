import Controller from './Controller';

/**
 * Decorator for page controllers. The decorator manages references to the meta
 * attributes manager and other utilities so these can be easily provided to
 * the decorated page controller when needed.
 *
 * @extends Controller
 */
export default class ControllerDecorator extends Controller {
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
  constructor(controller, metaManager, router, dictionary, settings) {
    super();

    /**
     * The controller being decorated.
     *
     * @type {Controller}
     */
    this._controller = controller;

    /**
     * The meta page attributes manager.
     *
     * @type {MetaManager}
     */
    this._metaManager = metaManager;

    /**
     * The application router.
     *
     * @type {Router}
     */
    this._router = router;

    /**
     * Localization phrases dictionary.
     *
     * @type {Dictionary}
     */
    this._dictionary = dictionary;

    /**
     * Application settings for the current application environment.
     *
     * @type {Object<string, *>}
     */
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
  setReactiveView(reactiveView) {
    this._controller.setReactiveView(reactiveView);
  }

  /**
   * @inheritdoc
   */
  setState(statePatch) {
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
  addExtension(extension) {
    this._controller.addExtension(extension);

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
  setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
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
  setPageStateManager(pageStateManager) {
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
   * @return {MetaManager} The Meta attributes manager configured by the
   *         decorated controller.
   */
  getMetaManager() {
    return this._metaManager;
  }
}
