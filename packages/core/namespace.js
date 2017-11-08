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
	 *        import ns from 'ima/namespace/ns.js';
	 *        ns.namespace('ima');
	 *        ns.has('ima');
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

    let self = this;
    let levels = path.split('.');

    for (let levelName of levels) {
      if (!self.hasOwnProperty(levelName)) {
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
    return typeof this.get(path) !== 'undefined';
  }

  /**
	 * Return value for the specified namespace path point.
	 *
	 * @param {string} path The namespace path to test.
	 * @return {*} The value at the specified path in the namespace.
	 */
  get(path) {
    let self = this;
    let levels = path.split('.');

    for (let level of levels) {
      if (!self[level]) {
        return undefined;
      }

      self = self[level];
    }

    return self;
  }
}

export default new Namespace();
