import ns from 'core/namespace/ns.js';

ns.namespace('App.Module.Feed');

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
	 * @param {String} baseUrl - Server URL.
	 * @param {String} apiUrl - API spectific URL.
	 * @param {App.Factory.Feed} feedFactory
	 * @param {Core.Cache.Handler} cache
	 * */
	constructor(http, baseUrl, apiUrl, categoryListFactory, cache) {
		super(http, baseUrl, apiUrl, categoryListFactory, cache);
	}
}

ns.App.Module.CategoryList.Resource = Resource;