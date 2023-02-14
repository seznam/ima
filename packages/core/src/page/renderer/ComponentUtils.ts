import {
  ObjectContainer,
  FactoryFunction,
  UnknownConstructable,
} from '../../ObjectContainer';
import { StringParameters, Utils } from '../../types';

export class ComponentUtils {
  /**
   * The application's dependency injector - the object container.
   */
  private _oc: ObjectContainer;
  /**
   * Map of registered utilities.
   */
  private _utilityClasses: {
    [key: string]: UnknownConstructable | FactoryFunction;
  } = {};
  /**
   * Map of instantiated utilities
   */
  private _utilities?: Utils;

  /**
   * Map of referrers to utilities
   */
  private _utilityReferrers: StringParameters = {};

  /**
   * Initializes the registry used for managing component utils.
   *
   * @param oc The application's dependency injector - the
   *        object container.
   */
  constructor(oc: ObjectContainer) {
    this._oc = oc;
  }

  /**
   * Registers single utility class or multiple classes in alias->class mapping.
   */
  register(
    name:
      | string
      | UnknownConstructable
      | FactoryFunction
      | { [key: string]: string | UnknownConstructable | FactoryFunction },
    componentUtilityClass?: UnknownConstructable | FactoryFunction,
    referrer?: string
  ) {
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

        this.register(
          alias,
          utilityClasses[alias] as UnknownConstructable | FactoryFunction,
          referrer
        );
      }
    }
  }

  /**
   * Returns object containing all registered utilities
   */
  getUtils(): Utils {
    if (this._utilities) {
      return this._utilities;
    }

    this._utilities = {} as Utils;

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

  _createUtilityInstance(
    alias: string,
    utilityClass: UnknownConstructable | FactoryFunction
  ) {
    // @ts-expect-error needs complete type rewrite...
    return ((this._utilities as Utils)[alias as keyof Utils] =
      this._oc.get(utilityClass));
  }
}
