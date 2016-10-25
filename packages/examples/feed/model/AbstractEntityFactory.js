import AbstractEntity from 'app/model/AbstractEntity';

/**
 * Base class for entity factories.
 *
 * @class AbstractEntityFactory
 * @namespace app.model
 * @module app
 * @submodule app.model
 */
export default class AbstractEntityFactory {

	/**
	 * @constructor
	 * @method constructor
	 * @param {function(new: AbstractEntity, Object<string, *>)} entityConstructor
	 */
	constructor(entityConstructor) {

		/**
		 * @private
		 * @property _entity
		 * @type {function(new: AbstractEntity, Object<string, *>)}
		 */
		this._entityConstructor = entityConstructor;
	}

	/**
	 * Creates a list of entities from the provided data.
	 *
	 * @method createEntityList
	 * @param {Object<string, *>[]} data
	 * @return {AbstractEntity[]}
	 */
	createEntityList(data) {
		let array = data;
		let entityList = [];

		for (let arrayData of array) {
			let entity = this.createEntity(arrayData);
			entityList.push(entity);
		}

		return entityList;
	}

	/**
	 * Creates a new entity from the provided data.
	 *
	 * @method createEntity
	 * @param {Object<string, *>} data
	 * @return {AbstractEntity}
	 */
	createEntity(data) {
		return new this._entityConstructor(data);
	}
}
