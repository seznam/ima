import AbstractEntity from 'app/model/AbstractEntity';

/**
 * Category entity.
 */
export default class CategoryEntity extends AbstractEntity {
  /**
   * @param {Object<string, *>} data
   */
  constructor(data) {
    super(data._id);

    /**
     * Name of category.
     *
     * @type {string}
     */
    this._name = data.name;

    /**
     * Name to use in URL.
     *
     * @type {string}
     */
    this._urlName = data.urlname;

    /**
     * Hash tag
     *
     * @type {string}
     */
    this._hashTag = data.hashtag;

    /**
     * Image Url.
     *
     * @type {string}
     */
    this._iconUrl = data.iconurl;
  }

  /**
   * Getter for _name.
   *
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Getter for _urlName.
   *
   * @return {string}
   */
  getUrlName() {
    return this._urlName;
  }

  /**
   * Getter for _hashTag.
   *
   * @return {string}
   */
  getHashTag() {
    return this._hashTag;
  }

  /**
   * Getter for _iconUrl.
   *
   * @return {string}
   */
  getIconUrl() {
    return this._iconUrl;
  }
}
