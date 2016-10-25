
/**
 * Base class for model entities.
 *
 * @class AbstractEntity
 * @namespace app.model
 * @module app
 * @submodule app.model
 */
export default class AbstractEntity {

	/**
	 * @constructor
	 * @method constructor
	 * @param {*} id
	 */
	constructor(id) {

		/**
		 * Unique entity id.
		 *
		 * @property _id
		 * @private
		 * @type {*}
		 * @default id
		 * */
		this._id = id;
	}

	/**
	 * Return entity unique id.
	 *
	 * @method getId
	 * @return {*}
	 * */
	getId() {
		return this._id;
	}
}
