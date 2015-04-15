
/**
 * Namespace creation, manipulation and traversal utility. This utility is used
 * to create semi-global shared namespaces for registering references to
 * interfaces, classes and constants of the application to provide access to
 * each other more easily than by using the ES6 import/export mechanism.
 *
 * @class Namespace
 * @namespace Core.Namespace
 * @module Core
 * @submodule Core.Namespace
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
	 *        import ns from 'core/namespace/ns.js';
	 *        ns.namespace('Core');
	 *        ns.has('Core');
	 *        ns.Core.Oc = Oc;
	 */
	constructor() {}

	/**
	 * Verifies that the specified path in namespace exists, creates it if it
	 * does not, and returns the value at the specified path in the namespace.
	 *
	 * The method recursively creates all path parts in the namespaces as empty
	 * plain objects for all path parts that do not exist yet, including the last
	 * one. This means, that if called with a non-existing namespace path as an
	 * argument, the return value will be the last created namespace object.
	 *
	 * @method namespace
	 * @param {string} path The namespace path.
	 * @return {*} The value at the specified path in the namespace.
	 */
	namespace(path) {
		var level = this;
		var levels = path.split('.');

		for (var levelName of levels) {
			if (!level.hasOwnProperty(levelName)) {
				level[levelName] = {};
			}

			level = level[levelName];
		}

		return level;
	}

	/**
	 * Verifies that the specified namespace path point to an existing namespace
	 * or terminal value.
	 *
	 * @method has
	 * @param {string} path The namespace path to test.
	 * @return {boolean} {@code true} if the namespace or terminal value exists
	 *         at the specified path.
	 */
	has(path) {
		var object = this;
		var levels = path.split('.');

		for (var level of levels) {
			if (!object[level]) {
				return false;
			}

			object = object[level];
		}

		return true;
	}
}

export default new Namespace();
