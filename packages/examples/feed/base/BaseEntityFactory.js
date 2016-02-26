import ns from 'ima/namespace';

ns.namespace('app.base');

/**
 * Base factory entity. Creates all entities.
 *
 * @class BaseEntityFactory
 * @namespace app.base
 * @module app
 * @submodule app.base
 */
export default class BaseEntityFactory {

	/**
	 * @constructor
	 * @method constructor
	 * @param {app.base.BaseEntity} EntityConstructor - name of entity
	 */
	constructor(EntityConstructor) {

		/**
		 * @property _entity
		 * @private
		 * @type {String}
		 * @default entity
		 */
		this._EntityConstructor = EntityConstructor;
	}

	/**
	 * Creates list defined entities.
	 *
	 * @method createEntityList
	 * @param {Object} data
	 * @return {Array<app.base.BaseEntity>}
	 */
	createEntityList(data) {
		var array = data;
		var entityList = [];

		for (var arrayData of array) {
			var entity = this.createEntity(arrayData);
			entityList.push(entity);
		}

		return entityList;
	}

	/**
	 * Creates Base Entity
	 *
	 * @method createEntity
	 * @param {Object} data
	 * @return {app.base.BaseEntity}
	 */
	createEntity(data) {
		return new this._EntityConstructor(data);
	}
}

ns.app.base.BaseEntityFactory = BaseEntityFactory;
