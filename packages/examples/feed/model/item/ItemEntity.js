import AbstractEntity from 'app/model/AbstractEntity';

/**
 * Feed item entity.
 */
export default class ItemEntity extends AbstractEntity {
  /**
   * @param {Object<string, *>} data
   */
  constructor(data) {
    super(data._id);

    /**
     * Text of item.
     *
     * @type {string}
     */
    this._content = data.content;

    /**
     * ID of the service to which this feed item is related.
     *
     * @type {number}
     */
    this._category = data.category;

    /**
     * Dete of item publication.
     *
     * @type {Date}
     */
    this._posted = new Date(data.date);
  }

  /**
   * Getter for text.
   *
   * @return {string}
   */
  getContent() {
    return this._content;
  }

  /**
   * Getter for service.
   *
   * @return {number}
   */
  getCategoryId() {
    return this._category;
  }

  /**
   * Getter for posted.
   *
   * @return {Date}
   */
  getPosted() {
    return this._posted;
  }
}
