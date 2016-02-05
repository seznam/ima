import ns from 'imajs/client/core/namespace';

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
	 */
	constructor(id) {

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
