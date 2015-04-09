
/**
 * @class Ns
 * @namespace Core.Namespace
 * @module Core
 * @submodule Core.Namespace
 */
class Ns {

	/**
	 * Initializes the namespace provider.
	 *
	 * This is a private constructor, you should use the exported <code>ns</code>
	 * instance to create and use namespaces (see the examples).
	 *
	 * @private
	 * @constructor
	 * @method constructor
	 * @example
	 *        ns.namespace('Core');
	 *        ns.has('Core');
	 *        ns.Core.Oc = Oc;
	 */
	constructor() {

	}

	/**
	 * Create new object for assign namespace and return it.
	 *
	 * @method namespace
	 * @param {string} nameSpace - the name of the namespace to create
	 * @return {*} - stored value
	 */
	namespace(nameSpace) {
		var that = this;
		var levels = nameSpace.split('.');

		for (var i = 0; i < levels.length; i++) {

			if (typeof that[levels[i]] === 'undefined') {
				that[levels[i]] = {};
			}

			that = that[levels[i]];
		}

		return that;
	}

	/**
	 * Check fullfilled for assign namespace.
	 *
	 * @method has
	 * @param {string} nameSpace - assign namespace
	 * @return {boolean} - <code>true</code> if namespace exists
	 */
	has(nameSpace) {
		var object = this;
		var levels = nameSpace.split('.');

		for (var i = 0; i < levels.length; i++) {

			if (typeof object[levels[i]] === 'undefined') {
				return false;
			}

			object = object[levels[i]];
		}

		return true;
	}
}

var ns = new Ns(); // jshint ignore:line

export default ns;