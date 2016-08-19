export let init = (ns, oc, config) => {

	//*************START CONSTANT**************
	oc.constant('API_BASE_URL', config.Api.baseUrl);
	oc.constant('CATEGORIES_API_URL', config.Api.baseUrl + config.Api.categories);
	oc.constant('ITEMS_API_URL', config.Api.baseUrl + config.Api.items);
	oc.constant('DEFAULT_PORTAL_ICON', config.Images.defaultCategoryListIcon);
	//*************END CONSTANT****************

	// Our fake http handler for demo. You can use superagent (It's binded in IMA.js Core like '$Http') instead of fakeHttp.
	oc.bind('$Http', ns.app.model.FakeHttp, ['API_BASE_URL']);

	// Category Module
	oc.constant('CategoryEntity', ns.app.model.category.CategoryEntity);
	oc.bind('CategoryFactory', ns.app.model.category.CategoryFactory, ['CategoryEntity']);

	//CategoryList Module
	oc.constant('CategoryListEntity', ns.app.model.categoryList.CategoryListEntity);
	oc.bind('CategoryListFactory', ns.app.model.categoryList.CategoryListFactory, ['CategoryListEntity', 'CategoryFactory']);
	oc.bind('CategoryListResource', ns.app.model.categoryList.CategoryListResource, ['$Http', 'CATEGORIES_API_URL', 'CategoryListFactory', '$Cache']);
	oc.bind('CategoryListService', ns.app.model.categoryList.CategoryListService, ['CategoryListResource']);

	// Item Module
	oc.constant('ItemEntity', ns.app.model.item.ItemEntity);
	oc.bind('ItemFactory', ns.app.model.item.ItemFactory, ['ItemEntity']);
	oc.bind('ItemResource', ns.app.model.item.ItemResource, ['$Http', 'ITEMS_API_URL', 'ItemFactory', '$Cache']);
	oc.bind('ItemService', ns.app.model.item.ItemService, ['ItemResource']);

	// Feed Module
	oc.constant('FeedEntity', ns.app.model.feed.FeedEntity);
	oc.bind('FeedFactory', ns.app.model.feed.FeedFactory, ['FeedEntity', 'ItemFactory']);
	oc.bind('FeedResource', ns.app.model.feed.FeedResource, ['$Http', 'ITEMS_API_URL', 'FeedFactory', '$Cache']);
	oc.bind('FeedService', ns.app.model.feed.FeedService, ['FeedResource', 'CategoryListService']);

	// Page Home
	oc.inject(ns.app.page.home.Controller, ['FeedService', 'CategoryListService', 'ItemResource']);

	// Page Detail
	oc.inject(ns.app.page.detail.Controller, ['ItemService', 'CategoryListService']);

	// Error
	oc.inject(ns.app.page.error.Controller, []);

	// Not-Found
	oc.inject(ns.app.page.notFound.Controller, []);

	//COMPONENT Utils
	oc.constant('$Utils', {
		$Router: oc.get('$Router'),
		$Dictionary: oc.get('$Dictionary'),
		$EventBus: oc.get('$EventBus'),
		$Settings: oc.get('$Settings'),
		$Window: oc.get('$Window')
	});
};
