import ns from 'core/namespace/ns.js';

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
	 * @param {String} entity - name of entity
	 */
	constructor(entity) {
		super();
		/**
		 * @property _entity
		 * @private
		 * @type {String}
		 * @default entity
		 */
		this._entity = entity;
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
		return ns.oc.create(this._entity, data);
	}
}

ns.App.Base.EntityFactory = EntityFactory;