
/**
 * Base class for model entities.
 */
export default class AbstractEntity {

	/**
	 * @param {*} id
	 */
	constructor(id) {

		/**
		 * Unique entity id.
		 *
		 * @type {*}
		 */
		this._id = id;
	}

	/**
	 * Return entity unique id.
	 *
	 * @return {*}
	 */
	getId() {
		return this._id;
	}
}
