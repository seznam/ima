import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Page.Render');

/**
 * Factory for page render.
 *
 * @class Factory
 * @namespace Core.Page.Render
 * @module Core
 * @submodule Core.Page
 *
 * @requires Core.ObjectContainer
 */
export default class Factory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.ObjectContainer} oc
	 */
	constructor(oc) {

		/**
		 * @property _oc
		 * @private
		 * @type {Core.ObjectContainer}
		 */
		this._oc = oc;
	}

	/**
	 * Return object of services which are defined for alias $Utils.
	 *
	 * @method getUtils
	 */
	getUtils() {
		return this._oc.get('$Utils');
	}
}

ns.Core.Page.Render.Factory = Factory;
