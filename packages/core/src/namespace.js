//let namespaceWarningEmitted = false;

/**
 * Namespace creation, manipulation and traversal utility. This utility is used
 * to create semi-global shared namespaces for registering references to
 * interfaces, classes and constants of the application to provide access to
 * each other more easily than by using the ES6 import/export mechanism.
 *
 * @deprecated
 */
export class Namespace {
  /**
   * Initializes the namespace provider.
   *
   * This is a private constructor, you should use the exported {@code ns}
   * instance to create and use namespaces (see the examples).
   *
   * @private
   * @example
   *        import { ns } from '@ima/core';
   *        ns.namespace('ima.core');
   *        ns.has('ima.core');
   */
  constructor() {}

  /**
   * Verifies that the specified path in namespace exists, creates it if it
   * does not, and returns the value at the specified path in the namespace.
   *
   * The method recursively creates all path parts in the namespaces as empty
   * plain objects for all path parts that do not exist yet, including the
   * last one. This means, that if called with a non-existing namespace path
   * as an argument, the return value will be the last created namespace
   * object.
   *
   * @deprecated
   * @param {string} path The namespace path.
   * @return {*} The value at the specified path in the namespace.
   */
  namespace(path) {
    /*if (
			(typeof $Debug !== 'undefined') &&
			$Debug &&
			/^app./i.test(path) &&
			!namespaceWarningEmitted
		) {
			console.warn(
				'DEPRECATION WARNING: Your application seems to be using ' +
				`namespaces (attempted to create the ${path} namespace), ` +
				'but namespaces were deprecated since IMA 0.12.0. Please ' +
				'switch to ES6 imports as the support for namespaces will ' +
				'be removed in an upcoming version of IMA.js.'
			);
			namespaceWarningEmitted = true;
		}*/

    const levels = this._resolvePathLevels(path);
    let self = this;

    for (const levelName of levels) {
      if (!Object.prototype.hasOwnProperty.call(self, levelName)) {
        self[levelName] = {};
      }

      self = self[levelName];
    }

    return self;
  }

  /**
   * Verifies that the specified namespace path point to an existing
   * namespace or terminal value.
   *
   * @param {string} path The namespace path to test.
   * @return {boolean} {@code true} if the namespace or terminal value exists
   *         at the specified path.
   */
  has(path) {
    let hasPath;
    try {
      hasPath = this.get(path) !== undefined;
    } catch (e) {
      hasPath = false;
    }

    return hasPath;
  }

  /**
   * Return value for the specified namespace path point or undefined if path is not type of string
   *
   * @param {string} path The namespace path to get.
   * @return {*} The value at the specified path in the namespace or undefined for any non-string path
   */
  get(path) {
    const levels = this._resolvePathLevels(path);

    let self = this;

    for (let level of levels) {
      if (!self[level]) {
        return undefined;
      }

      self = self[level];
    }

    return self;
  }

  /**
   * Set value for the specified namespace path point.
   *
   * @param {string} path The namespace path to set.
   * @param {*} value
   */
  set(path, value) {
    const levels = this._resolvePathLevels(path);

    const lastKey = levels.pop();
    const namespace = this.namespace(levels.join('.'));

    namespace[lastKey] = value;
  }

  /**
   * Resolve path levels from string
   *
   * @param {string} path The namespace path.
   * @param {*} array of levels or undefined for not valid path
   */
  _resolvePathLevels(path) {
    if (!path || typeof path !== 'string') {
      throw Error('namespace.get: path is not type of string');
    }

    return path.split('.');
  }
}

export default new Namespace();
