import ns from 'ima/namespace';
import BaseEntityFactory from 'app/base/BaseEntityFactory';

ns.namespace('app.model.feed');

/**
 * Factory to create feed entity.
 *
 * @class FeedFactory
 * @extends app.base.BaseEntityFactory
 * @namespace app.model.feed
 * @module app
 * @submodule app.model
 */
class FeedFactory extends BaseEntityFactory {
	/**
	 * @constructor
	 * @method constructor
	 * @param {app.model.feed.FeedEntity} FeedEntityConstructor
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
	 * @return {app.model.feed.FeedEntity}
	 */
	createEntity(data) {
		var itemEntityList = this._itemFactory.createEntityList(data.items);

		return super.createEntity({ _id: 'feed', items: itemEntityList });
	}
}

ns.app.model.feed.FeedFactory = FeedFactory;
