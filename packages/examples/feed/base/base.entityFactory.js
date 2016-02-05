import ns from 'imajs/client/core/namespace';

ns.namespace('App.Base');

/**
 * Base factory entity. Creates all entities.
 *
 * @class EntityFactory
 * @extends App.Interface.EntityFactory
 * @namespace App.Base
 * @module App
 * @submodule App.Base
 */
class EntityFactory extends ns.App.Interface.EntityFactory {

	/**
	 * @constructor
	 * @method constructor
	 * @param {App.Base.Entity} EntityConstructor - name of entity
	 */
	constructor(EntityConstructor) {
		super();
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
	 * @return {Array[App.Base.Entity]}
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
	 * @return {App.Base.Entity}
	 */
	createEntity(data) {
		return new this._EntityConstructor(data);
	}
}

ns.App.Base.EntityFactory = EntityFactory;
