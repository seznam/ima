import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.CategoryList');

/**
 * Resource for feed.
 *
 * @class Resource
 * @extends App.Base.Resource
 * @namespace App.Module.Feed
 * @module App
 * @submodule App.Module
 */
class Resource extends ns.App.Base.Resource {
	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Http.Handler} http
	 * @param {String} url - API URL (Base server + api specific path.)
	 * @param {App.Factory.Feed} feedFactory
	 * @param {Core.Cache.Handler} cache
	 * */
	constructor(http, apiUrl, categoryListFactory, cache) {
		super(http, apiUrl, categoryListFactory, cache);
	}
}

ns.App.Module.CategoryList.Resource = Resource;
