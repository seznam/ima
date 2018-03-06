import AbstractEntity from 'app/model/AbstractEntity';

/**
 * Feed item entity.
 */
export default class FeedEntity extends AbstractEntity {
  /**
   * @param {Object<string, *>} data
   */
  constructor(data) {
    super(data._id);

    /**
     * Entity list - feed items.
     *
     * @type {ItemEntity[]}
     */
    this._items = data.items;
  }

  /**
   * Getter for items
   *
   * @return {ItemEntity[]}
   */
  getItems() {
    return this._items;
  }

  /**
   * Setter for items
   *
   * @param {ItemEntity[]} items
   * @return {FeedEntity}
   */
  setItems(items) {
    this._items = items;
    return this;
  }
}
