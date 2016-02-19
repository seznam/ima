import ns from 'ima/namespace';

ns.namespace('Ima.Http');

/**
 * Transform given string by defined rules.
 *
 * @class Transformer
 * @namespace Ima.Http
 * @module Ima
 * @submodule Ima.Http
 */
class Transformer {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {

		/**
		 * @property _rules
		 * @private
		 * @type {Object<string, string>}
		 */
		this._rules = {};
	}

	/**
	 * Add transformation rule to transformer.
	 *
	 * @method addRule
	 * @chainable
	 * @param {string} key
	 * @param {string} value
	 * @return {Ima.Http.Transformer} This transformer.
	 */
	addRule(key, value) {
		this._rules[key] = value;

		return this;
	}

	/**
	 * Clear all rules.
	 *
	 * @method clear
	 * @chainable
	 * @return {Ima.Http.Transformer} This transformer.
	 */
	clear() {
		this._rules = {};

		return this;
	}

	/**
	 * For given string apply all rules. Method use all rules and try replace
	 * defined key of rule with value of rule.
	 *
	 * @method transform
	 * @param {string} str The string for transformation.
	 * @return {string} transformed string
	 */
	transform(str) {
		var rulesKey = Object.keys(this._rules);

		if (rulesKey.length === 0) {
			return str;
		}

		var  reg =  new RegExp(rulesKey.join('|'), 'g');

		return str.replace(reg, (ruleKey) => this._rules[ruleKey]);
	}
}

ns.Ima.Http.Transformer = Transformer;
