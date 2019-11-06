import AbstractService from 'app/model/AbstractService';
import ItemResource from 'app/model/item/ItemResource';

/**
 * Class for the feed model.
 * It's a model of the feed model.
 */
export default class ItemService extends AbstractService {
  static get $dependencies() {
    return [ItemResource];
  }

  /**
   * @param {ItemResource} itemResource
   */
  constructor(itemResource) {
    super(itemResource);
  }

  /**
   * @param {?string} [itemId=null]
   * @return {Promise<ItemEntity>}
   */
  load(itemId) {
    return this._resource.getEntity(itemId);
  }
}
