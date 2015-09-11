import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.CategoryList');

/**
 * Factory to create feed entity.
 *
 * @class Factory
 * @extends App.Base.EntityFactory
 * @namespace App.Module.Feed
 * @module App
 * @submodule App.Module
 */
class Factory extends ns.App.Base.EntityFactory {
	/**
	 * @constructor
	 * @method constructor
	 * @param {App.Module.CategoryList.Entity} CategoryListEntityConstructor
	 */
	constructor(CategoryListEntityConstructor, categoryFactory) {
		super(CategoryListEntityConstructor);

		this._categoryFactory = categoryFactory;
	}

	/**
	 * Creates Entity of feed
	 *
	 * @method createEntity
	 * @param {Object} data
	 * @return {App.Base.Entity}
	 */
	createEntity(data) {
		var categoryEntityList = this._categoryFactory.createEntityList(data.categories);

		return super.createEntity({ _id: 'categories', categories: categoryEntityList });
	}
}

ns.App.Module.CategoryList.Factory = Factory;
