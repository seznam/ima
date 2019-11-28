import AbstractResource from 'app/model/AbstractResource';

/**
 * Resource for categories.
 */
export default class CategoryListResource extends AbstractResource {
  /**
   * @param {HttpAgent} http
   * @param {string} apiUrl API URL (Base server + api specific path.)
   * @param {CategoryListFactory} categoryListFactory
   * @param {Cache} cache
   */
  constructor(http, apiUrl, categoryListFactory, cache) {
    super(http, apiUrl, categoryListFactory, cache);
  }
}
