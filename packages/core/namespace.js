
/**
 * Namespace creation, manipulation and traversal utility. This utility is used
 * to create semi-global shared namespaces for registering references to
 * interfaces, classes and constants of the application to provide access to
 * each other more easily than by using the ES6 import/export mechanism.
 *
 * @deprecated
 * @class Namespace
 * @namespace ima
 * @module ima
 */
class Namespace {
	/**
	 * Initializes the namespace provider.
	 *
	 * This is a private constructor, you should use the exported {@code ns}
	 * instance to create and use namespaces (see the examples).
	 *
	 * @private
	 * @constructor
	 * @method constructor
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
	 * @method namespace
	 * @param {string} path The namespace path.
	 * @return {*} The value at the specified path in the namespace.
	 */
	namespace(path) {
		var self = this;
		var levels = path.split('.');

		for (var levelName of levels) {
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
	 * @method has
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
	 * @method get
	 * @param {string} path The namespace path to test.
	 * @return {*} The value at the specified path in the namespace.
	 */
	get(path) {
		var self = this;
		var levels = path.split('.');

		for (var level of levels) {
			if (!self[level]) {
				return undefined;
			}

			self = self[level];
		}

		return self;
	}
}

export default new Namespace();
