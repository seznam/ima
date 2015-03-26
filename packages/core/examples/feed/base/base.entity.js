import ns from 'core/namespace/ns.js';

ns.namespace('App.Base');


/**
 * @class Entity
 * @namespace App.Base
 * @module App
 * @submodule App.Base
 *
 * @requires App.Interface.Entity
 * */
class Entity extends ns.App.Interface.Entity {

	/**
	 * @constructor
	 * @method constructor
	 * @param {Mixed} id
	 * @param {Mixed} [type=null]
	 */
	constructor(id, type = null) {

		super();

		/**
		 * Unique entity id.
		 *
		 * @property _id
		 * @private
		 * @type {Mixed}
		 * @default id
		 * */
		this._id = id;
	}

	/**
	 * Return entity unique id.
	 *
	 * @method getId
	 * @return {Mixed}
	 * */
	getId() {
		return this._id;
	}
}

ns.App.Base.Entity  = Entity;