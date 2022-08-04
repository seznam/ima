import { ObjectContainer } from '@ima/core';

export default class ComponentUtils {
  private _oc: ObjectContainer;

  /**
   * Map of instantiated utilities.
   */
  private _utilities?: { [key: string]: Object };
  private _utilityClasses: { [key: string]: Function };
  private _utilityReferrers: { [key: string]: string };

  /**
   * Initializes the registry used for managing component utils.
   *
   * @param oc The application's dependency injector - the
   *        object container.
   */
  constructor(oc: ObjectContainer) {
    /**
     * The application's dependency injector - the object container.
     */
    this._oc = oc;

    /**
     * Map of registered utilities.
     */
    this._utilityClasses = {};

    /**
     * Map of referrers to utilities
     */
    this._utilityReferrers = {};
  }

  /**
   * Registers single utility class or multiple classes in alias->class mapping.
   *
   * @param name
   * @param componentUtilityClass
   * @param referrer
   */
  register(name: string | { [key: string]: Function } | Function, componentUtilityClass: Function, referrer?: string) {
    if (
      typeof componentUtilityClass === 'function' ||
      typeof componentUtilityClass === 'string'
    ) {
      const alias = String(name);
      this._utilityClasses[alias] = componentUtilityClass;

      if (referrer && typeof referrer === 'string') {
        this._utilityReferrers[alias] = referrer;
      }

      if (this._utilities) {
        this._createUtilityInstance(alias, componentUtilityClass);
      }
    } else if (
      name &&
      typeof name === 'object' &&
      name.constructor === Object
    ) {
      const utilityClasses = name;
      referrer = componentUtilityClass;

      for (const alias of Object.keys(utilityClasses)) {
        if (!Object.prototype.hasOwnProperty.call(utilityClasses, alias)) {
          continue;
        }

        this.register(alias, utilityClasses[alias], referrer);
      }
    }
  }

  /**
   * Returns object containing all registered utilities
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

  getReferrers() {
    return this._utilityReferrers;
  }

  private _createUtilityInstance(alias: string, utilityClass: Function) {
    if (this._utilities) {
      return (this._utilities[alias] = this._oc.get(utilityClass));
    }

    throw new Error(
      'Map of instantiated utilities is not initialized.'
    );
  }
}
