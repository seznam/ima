export default class ComponentUtils {
  /**
   * Initializes the registry used for managing component utils.
   *
   * @param {ObjectContainer} oc The application's dependency injector - the
   *        object container.
   */
  constructor(oc) {
    /**
     * The application's dependency injector - the object container.
     *
     * @type {ObjectContainer}
     */
    this._oc = oc;

    /**
     * Map of registered utilities.
     *
     * @type {Object<string, Object>}
     */
    this._utilities = {};
  }

  /**
   * Registers single utility class or multiple classes in alias->class mapping.
   *
   * @param {function(new: Object)|Object<string, function(new: Object)>} componentUtilityClass
   * @param {string|null} alias
   * @returns {Object|Object<string, Object>}
   */
  register(componentUtilityClass, alias = null) {
    if (typeof componentUtilityClass === 'function') {
      this._utilities[
        alias || componentUtilityClass.name
      ] = componentUtilityClass;
    } else if (typeof componentUtilityClass === 'object') {
      for (const alias of Object.keys(componentUtilityClass)) {
        if (!componentUtilityClass.hasOwnProperty(alias)) {
          continue;
        }

        this._utilities[alias] = componentUtilityClass[alias];
      }
    }
  }

  /**
   * Returns object containing all registered utilities
   *
   * @returns {Object<string, Object>}
   */
  getUtils() {
    if (this._oc.has('$Utils')) {
      // fallback for backward compatibility
      return this._oc.get('$Utils');
    }

    const utilities = {};

    // create instance of each utility class
    for (const utilityAlias of Object.keys(this._utilities)) {
      utilities[utilityAlias] = this._oc.get(this._utilities[utilityAlias]);
    }

    return utilities;
  }
}
