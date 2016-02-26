import ns from 'ima/namespace';

ns.namespace('app.base');


/**
 * @class BaseEntity
 * @namespace app.base
 * @module app
 * @submodule app.base
 * */
export default class BaseEntity {

	/**
	 * @constructor
	 * @method constructor
	 * @param {Mixed} id
	 */
	constructor(id) {

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

ns.app.base.BaseEntity  = BaseEntity;
