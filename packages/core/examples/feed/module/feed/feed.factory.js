import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.Feed');

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
	 * @param {App.Module.Feed.Entity} FeedEntityConstructor
	 */
	constructor(FeedEntityConstructor, itemFactory) {
		super(FeedEntityConstructor);

		this._itemFactory = itemFactory;
	}

	/**
	 * Creates Entity of feed
	 *
	 * @method createEntity
	 * @param {Object} data
	 * @return {App.Base.Entity}
	 */
	createEntity(data) {
		var itemEntityList = this._itemFactory.createEntityList(data.items);

		return super.createEntity({ _id: 'feed', items: itemEntityList });
	}
}

ns.App.Module.Feed.Factory = Factory;
