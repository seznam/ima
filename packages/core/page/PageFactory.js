import GenericError from '../error/GenericError';

/**
 * Factory for page.
 */
export default class PageFactory {
  /**
   * Factory used by page management classes.
   *
   * @param {ObjectContainer} oc
   */
  constructor(oc) {
    /**
     * The current application object container.
     *
     * @type {ObjectContainer}
     */
    this._oc = oc;
  }

  /**
   * Create new instance of {@linkcode Controller}.
   *
   * @param {(string|function(new:Controller))} controller
   * @return {Controller}
   */
  createController(controller) {
    let controllerInstance = this._oc.create(controller);

    return controllerInstance;
  }

  /**
   * Retrieves the specified react component class.
   *
   * @param {(string|function(new: React.Component))} view The namespace
   *        referring to a react component class, or a react component class
   *        constructor.
   * @return {function(new: React.Component)} The react component class
   *         constructor.
   */
  createView(view) {
    if (typeof view === 'function') {
      return view;
    }
    let classConstructor = this._oc.getConstructorOf(view);

    if (classConstructor) {
      return classConstructor;
    } else {
      throw new GenericError(
        `ima.page.Factory:createView hasn't name of view "${view}".`
      );
    }
  }

  /**
   * Returns decorated controller for ease setting seo params in controller.
   *
   * @param {Controller} controller
   * @return {Controller}
   */
  decorateController(controller) {
    let metaManager = this._oc.get('$MetaManager');
    let router = this._oc.get('$Router');
    let dictionary = this._oc.get('$Dictionary');
    let settings = this._oc.get('$Settings');

    let decoratedController = this._oc.create('$ControllerDecorator', [
      controller,
      metaManager,
      router,
      dictionary,
      settings
    ]);

    return decoratedController;
  }

  /**
   * Returns decorated page state manager for extension.
   *
   * @param {PageStateManager} pageStateManager
   * @param {string[]} allowedStateKeys
   * @return {PageStateManager}
   */
  decoratePageStateManager(pageStateManager, allowedStateKeys) {
    let decoratedPageStateManager = this._oc.create(
      '$PageStateManagerDecorator',
      [pageStateManager, allowedStateKeys]
    );

    return decoratedPageStateManager;
  }
}
