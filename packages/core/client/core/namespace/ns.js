/**
 * @class Ns
 * @namespace Core.Namespace
 * @module Core
 * @submodule Core.Namespace
 */

class Ns {

	/**
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
	 * @param {String} nameSpace - assign namespace
	 * @return {Mixed} - stored value
	 * */
	namespace(nameSpace) {
		var that = this;
		var levels = nameSpace.split('.');

		for (var i = 0; i < levels.length; i++) {

			if (typeof(that[levels[i]]) === 'undefined') {
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
	 * @param {String} nameSpace - assign namespace
	 * @return {Boolean} - true if namespace exists
	 * */
	has(nameSpace) {
		var object = this;
		var levels = nameSpace.split('.');

		for (var i = 0; i < levels.length; i++) {

			if (typeof(object[levels[i]]) === 'undefined') {
				return false;
			}

			object = object[levels[i]];
		}
		return true;
	}
}

var ns = new Ns(); // jshint ignore:line

export default ns;