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
     * @type {Object<string, function(new: T, ...*)|function(...*): T>}
     */
    this._utilityClasses = {};

    /**
     * Map of instantiated utilities
     *
     * @type {Object<string, Object>}
     */
    this._utilities = null;
  }

  /**
   * Registers single utility class or multiple classes in alias->class mapping.
   *
   * @param {string|Object<string, function(new: T, ...*)|function(...*): T>} name
   * @param {function(new: T, ...*)|function(...*): T} componentUtilityClass
   */
  register(name, componentUtilityClass) {
    if (typeof componentUtilityClass === 'function') {
      const alias = String(name);
      this._utilityClasses[alias] = componentUtilityClass;

      if (this._utilities) {
        this._createUtilityInstance(alias, componentUtilityClass);
      }
    } else if (
      name &&
      typeof name === 'object' &&
      name.constructor === Object
    ) {
      const utilityClasses = name;

      for (const alias of Object.keys(utilityClasses)) {
        if (!utilityClasses.hasOwnProperty(alias)) {
          continue;
        }

        this.register(alias, utilityClasses[alias]);
      }
    }
  }

  /**
   * Returns object containing all registered utilities
   *
   * @returns {Object<string, Object>}
   */
  getUtils() {
    if (this._utilities) {
      return this._utilities;
    }

    this._utilities = {};

    // create instance of each utility class
    for (const alias of Object.keys(this._utilityClasses)) {
      this._createUtilityInstance(alias, this._utilityClasses[alias]);
    }

    if (this._oc.has('$Utils')) {
      // fallback for backward compatibility
      Object.assign(this._utilities, this._oc.get('$Utils'));
    }

    return this._utilities;
  }

  /**
   * @template T
   * @param {string} alias
   * @param {function(new: T, ...*)|function(...*): T} utilityClass
   * @return {T}
   */
  _createUtilityInstance(alias, utilityClass) {
    return (this._utilities[alias] = this._oc.get(utilityClass));
  }
}
