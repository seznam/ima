import GenericError from '../error/GenericError';
import Controller from './Controller';

/**
 * Basic implementation of the {@link Controller} interface, providing the
 * default implementation of the most of the API.
 *
 * @abstract
 * @extends Controller
 */
export default class AbstractController extends Controller {
  /**
   * Initializes the controller.
   */
  constructor() {
    super();

    /**
     * State manager.
     *
     * @protected
     * @type {PageStateManager}
     */
    this._pageStateManager = null;

    /**
     * The controller's extensions.
     *
     * @type {Extension[]}
     */
    this._extensions = [];

    /**
     * The HTTP response code to send to the client.
     *
     * @type {number}
     */
    this.status = 200;

    /**
     * The route parameters extracted from the current route. This field is
     * set externally by IMA right before the {@link Controller#init} or the
     * {@link Controller#update} method is called.
     *
     * @type {Object<string, string>}
     */
    this.params = {};
  }

  /**
   * @inheritdoc
   */
  init() {}

  /**
   * @inheritdoc
   */
  destroy() {}

  /**
   * @inheritdoc
   */
  activate() {}

  /**
   * @inheritdoc
   */
  deactivate() {}

  /**
   * @inheritdoc
   * @abstract
   */
  load() {
    throw new GenericError(
      'The ima.controller.AbstractController.load method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * @inheritdoc
   */
  update(params = {}) {
    return {};
  }

  /**
   * @inheritdoc
   */
  setState(statePatch) {
    if (this._pageStateManager) {
      this._pageStateManager.setState(statePatch);
    }
  }

  /**
   * @inheritdoc
   */
  getState() {
    if (this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return {};
    }
  }

  /**
   * @inheritdoc
   */
  addExtension(extension) {
    this._extensions.push(extension);
  }

  /**
   * @inheritdoc
   */
  getExtensions() {
    return this._extensions;
  }

  /**
   * @inheritdoc
   * @abstract
   */
  setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
    throw new GenericError(
      'The ima.controller.AbstractController.setMetaParams method is ' +
        'abstract and must be overridden'
    );
  }

  /**
   * @inheritdoc
   */
  setRouteParams(params = {}) {
    this.params = params;
  }

  /**
   * @inheritdoc
   */
  getRouteParams() {
    return this.params;
  }

  /**
   * @inheritdoc
   */
  setPageStateManager(pageStateManager) {
    this._pageStateManager = pageStateManager;
  }

  /**
   * @inheritdoc
   */
  getHttpStatus() {
    return this.status;
  }
}
