import ns from 'ima/namespace';
import BaseResouce from 'app/base/BaseResource';

ns.namespace('app.model.categoryList');

/**
 * Resource for feed.
 *
 * @class CategoryListResource
 * @extends app.base.BaseResouce
 * @namespace app.model.categoryList
 * @module app
 * @submodule app.model
 */
class CategoryListResource extends BaseResouce {
	/**
	 * @method constructor
	 * @constructor
	 * @param {ima.http.HttpAgent} http
	 * @param {string} url - API URL (Base server + api specific path.)
	 * @param {app.model.categoryList.categoryListFactory} categoryListFactory
	 * @param {ima.cache.Cache} cache
	 * */
	constructor(http, apiUrl, categoryListFactory, cache) {
		super(http, apiUrl, categoryListFactory, cache);
	}
}

ns.app.model.categoryList.CategoryListResource = CategoryListResource;
