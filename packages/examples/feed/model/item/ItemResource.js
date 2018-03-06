import AbstractResource from 'app/model/AbstractResource';

/**
 * Resource for items.
 */
export default class ItemResource extends AbstractResource {
  /**
   * @param {HttpAgent} http
   * @param {string} apiUrl API URL (Base server + api specific path.)
   * @param {ItemFactory} itemFactory
   * @param {Cache} cache
   */
  constructor(http, apiUrl, itemFactory, cache) {
    super(http, apiUrl, itemFactory, cache);
  }

  /**
   * Method returns entity with list of items.
   *
   * @param {string} id Id of the item.
   * @return {Promise<ItemEntity>} Promise of item entity
   */
  getEntity(id) {
    return super.getEntity(null, { id: id });
  }

  /**
   * Method make request to API server and returns new entity.
   *
   * @param {Object<string, *>} data Data with text and category for create
   *        new entity.
   * @return {Promise<ItemEntity>} Promise of item entity
   */
  createEntity(data) {
    this._cache.clear();

    return super.createEntity(data);
  }
}
