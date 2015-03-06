import ns from 'core/namespace/ns.js';

ns.namespace('Core.Helper');

/**
 * @class Template
 * @namespace Core.Helper
 * @module Core
 * @submodule Core.Helper
 * */
class Template {

	/**
	 * @method constructor
	 * @constructor
	 * */
	constructor() {
	}

	/**
	 * Joins non-empty class names into string.
	 *
	 * @method joinClasses
	 * @param {Array|Object} classes Class names.
	 * @param {String} [separator=''] Class names separator.
	 * @return {String} String with joined class names.
	 */
	joinClasses(classes, separator = ' ') {
		var classStr;
		if (classes.constructor == Array) {
			classStr = classes.join(separator);
		} else {
			var cls = [];
			for (var cl in classes) {
				if (classes[cl]) {
					cls.push(cl);
				}
			}
			classStr = cls.join(separator);
		}

		return classStr;
	}

	/**
	 * Checks if the value is NaN.
	 *
	 * @method isNaN
	 * @param {Mixed} value The checked value.
	 * @return {Boolean} True if the value is NaN; otherwise false.
	 */
	isNaN(value) {
		return value !== value;
	}

	/**
	 * Capitalizes a first letter of the string.
	 *
	 * @method capitalizeFirstLetter
	 * @param {String} string
	 * @return {String} Capitalized string.
	 */
	capitalizeFirstLetter(string) {
		 return string.charAt(0).toUpperCase() + string.slice(1);
	}
}

ns.Core.Helper.Template = Template;