import AbstractResource from 'app/model/AbstractResource';

/**
 * Base class for model service.
 *
 * @class BaseService
 * @namespace app.model
 * @module app.model
 */
export default class AbstractService {

	/**
	 * @constructor
	 * @method constructor
	 * @param {AbstractResource} resource
	 */
	constructor(resource) {
		/**
		 * @private
		 * @property _resource
		 * @type {AbstractResource}
		 */
		this._resource = resource;
	}
}
