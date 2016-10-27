import AbstractEntityFactory from 'app/model/AbstractEntityFactory';
import FeedEntity from 'app/model/feed/FeedEntity';
import ItemFactory from 'app/model/item/ItemFactory';

/**
 * Factory to create feed entity.
 */
export default class FeedFactory extends AbstractEntityFactory {

	static get $dependencies() {
		return [ItemFactory];
	}

	/**
	 * @param {ItemFactory} itemFactory
	 */
	constructor(itemFactory) {
		super(FeedEntity);

		this._itemFactory = itemFactory;
	}

	/**
	 * Creates Entity of feed
	 *
	 * @param {Object<string, *>} data
	 * @return {FeedEntity}
	 */
	createEntity(data) {
		let itemEntityList = this._itemFactory.createEntityList(data.items);

		return super.createEntity({ _id: 'feed', items: itemEntityList });
	}
}
