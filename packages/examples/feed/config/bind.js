export var init = (ns, oc, config) => {

	//*************START CONSTANT**************
	oc.constant('API_BASE_URL', config.Api.baseUrl);
	oc.constant('CATEGORIES_API_URL', config.Api.baseUrl + config.Api.categories);
	oc.constant('ITEMS_API_URL', config.Api.baseUrl + config.Api.items);
	oc.constant('DEFAULT_PORTAL_ICON', config.Images.defaultCategoryListIcon);
	//*************END CONSTANT****************

	// Our fake http handler for demo. You can use superagent (It's binded in IMA.js Core like '$Http') instead of fakeHttp.
	oc.bind('$Http', ns.App.Module.FakeHttp, ['API_BASE_URL']);

	// Category Module
	oc.constant('CategoryEntity', ns.App.Module.Category.Entity);
	oc.bind('CategoryFactory', ns.App.Module.Category.Factory, ['CategoryEntity']);

	//CategoryList Module
	oc.constant('CategoryListEntity', ns.App.Module.CategoryList.Entity);
	oc.bind('CategoryListFactory', ns.App.Module.CategoryList.Factory, ['CategoryListEntity', 'CategoryFactory']);
	oc.bind('CategoryListResource', ns.App.Module.CategoryList.Resource, ['$Http', 'CATEGORIES_API_URL', 'CategoryListFactory', '$Cache']);
	oc.bind('CategoryListService', ns.App.Module.CategoryList.Service, ['CategoryListResource']);

	// Item Module
	oc.constant('ItemEntity', ns.App.Module.Item.Entity);
	oc.bind('ItemFactory', ns.App.Module.Item.Factory, ['ItemEntity']);
	oc.bind('ItemResource', ns.App.Module.Item.Resource, ['$Http', 'ITEMS_API_URL', 'ItemFactory', '$Cache']);
	oc.bind('ItemService', ns.App.Module.Item.Service, ['ItemResource']);

	// Feed Module
	oc.constant('FeedEntity', ns.App.Module.Feed.Entity);
	oc.bind('FeedFactory', ns.App.Module.Feed.Factory, ['FeedEntity', 'ItemFactory']);
	oc.bind('FeedResource', ns.App.Module.Feed.Resource, ['$Http', 'ITEMS_API_URL', 'FeedFactory', '$Cache']);
	oc.bind('FeedService', ns.App.Module.Feed.Service, ['FeedResource', 'CategoryListService']);

	// Page Home
	oc.inject(ns.App.Page.Home.Controller, ['FeedService', 'CategoryListService', 'ItemResource']);

	// Page Detail
	oc.inject(ns.App.Page.Detail.Controller, ['ItemService', 'CategoryListService']);

	// Error
	oc.inject(ns.App.Page.Error.Controller, []);

	// Not-Found
	oc.inject(ns.App.Page.NotFound.Controller, []);

	//COMPONENT Utils
	oc.constant('$Utils', {
		$Router: oc.get('$Router'),
		$Dictionary: oc.get('$Dictionary'),
		$EventBus: oc.get('$EventBus'),
		$Settings: oc.get('$Settings'),
		$Window: oc.get('$Window')
	});
};
