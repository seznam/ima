/**
 * Base class for model service.
 */
export default class AbstractService {
  /**
   * @param {AbstractResource} resource
   */
  constructor(resource) {
    /**
     * @type {AbstractResource}
     */
    this._resource = resource;
  }
}
