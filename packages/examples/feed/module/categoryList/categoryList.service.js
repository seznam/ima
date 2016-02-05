import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';

ns.namespace('App.Module.CategoryList');

/**
 * Class for the feed model.
 * It's a model of the feed model.
 *
 * @class Service
 * @extends App.Base.Service
 * @namespace App.Module.Feed
 * @module App
 * @submodule App.Module
 */
class Service extends ns.App.Base.Service {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Module.Feed.Resource} categoryListResource
	 */
	constructor(categoryListResource) {
		super();

		/**
		 * @property _categoryListResource
		 * @private
		 * @type {App.Module.Feed.Resource}
		 * @default categoryListResource
		 * */
		this._categoryListResource = categoryListResource;
	}

	/**
	 * Deinitialization model.
	 *
	 * @method deinit
	 * */
	deinit() {}

	/**
	 * Get category by url name.
	 *
	 * @method getCategoryByUrl
	 * @param {string|null} urlName
	 * @return {App.Entity.Category|null}
	 */
	getCategoryByUrl(urlName) {
		return this._categoryListResource
				.getEntity()
				.then((categoryListEntity) => {
					var categories = categoryListEntity.getCategories();

					if (!urlName) {
						return null;
					}

					for (var i = 0; i < categories.length; i++) {
						if (categories[i].getUrlName() === urlName) {
							return categories[i];
						}
					}

					throw new IMAError('Category not found.', { status: 404 });
				});
	}

	/**
	 * @method load
	 * @return {App.Module.CategoryList.Entity}
	 */
	load() {
		return this._categoryListResource.getEntity();
	}
}

ns.App.Module.CategoryList.Service = Service;
