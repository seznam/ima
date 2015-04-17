export var init = (ns, oc, config) => {

	//*************START CONSTANT**************
	var baseUrl = ns.Setting.$Http.baseUrl;
	oc.bind('CATEGORIES_API_URL', baseUrl + ns.Setting.Api.categories);
	oc.bind('ITEMS_API_URL', baseUrl + ns.Setting.Api.items);
	oc.bind('DEFAULT_PORTAL_ICON', ns.Setting.Images.defaultCategoryListIcon);
	//*************END CONSTANT****************

	// Our fake http handler for demo. You can use superagent (It's binded in IMA.js Core like '$Http') instead of fakeHttp.
	oc.bind('FakeHttp', oc.make('App.Module.FakeHttp', ['$BindPromise']));

	// Category Module
	oc.bind('CategoryEntity', ns.App.Module.Category.Entity);
	oc.bind('CategoryFactory', oc.make('App.Module.Category.Factory', []));

	//CategoryList Module
	oc.bind('CategoryListEntity', ns.App.Module.CategoryList.Entity);
	oc.bind('CategoryListFactory', oc.make('App.Module.CategoryList.Factory', ['CategoryFactory']));
	oc.bind('CategoryListResource', oc.make('App.Module.CategoryList.Resource', ['FakeHttp', 'CATEGORIES_API_URL', 'CategoryListFactory', '$Cache']));
	oc.bind('CategoryListService', oc.make('App.Module.CategoryList.Service', ['CategoryListResource']));

	// Item Module
	oc.bind('ItemEntity', ns.App.Module.Item.Entity);
	oc.bind('ItemFactory', oc.make('App.Module.Item.Factory', []));
	oc.bind('ItemResource', oc.make('App.Module.Item.Resource', ['FakeHttp', 'ITEMS_API_URL', 'ItemFactory', '$Cache']));
	oc.bind('ItemService', oc.make('App.Module.Item.Service', ['ItemResource']));

	// Feed Module	
	oc.bind('FeedEntity', ns.App.Module.Feed.Entity);
	oc.bind('FeedFactory', oc.make('App.Module.Feed.Factory', ['ItemFactory']));
	oc.bind('FeedResource', oc.make('App.Module.Feed.Resource', ['FakeHttp', 'ITEMS_API_URL', 'FeedFactory', '$Cache']));
	oc.bind('FeedService', oc.make('App.Module.Feed.Service', ['FeedResource', 'CategoryListService']));
	
	// Page Home
	oc.bind('HomeView', ns.App.Page.Home.View, ['$BindReact']);
	oc.bind('HomeController', ns.App.Page.Home.Controller, ['HomeView', 'FeedService', 'CategoryListService', 'ItemResource', '$Dispatcher']);

	// Page Detail
	oc.bind('DetailView', ns.App.Page.Detail.View, ['$BindReact']);
	oc.bind('DetailController', ns.App.Page.Detail.Controller, ['DetailView', 'ItemService', 'CategoryListService']);

	// Page Error
	oc.bind('ErrorView', ns.App.Page.Error.View, ['$BindReact']);
	oc.bind('ErrorController', ns.App.Page.Error.Controller, ['ErrorView', '$BindPromise']);

	// Page Not Found
	oc.bind('NotFoundView', ns.App.Page.NotFound.View, ['$BindReact']);
	oc.bind('NotFoundController', ns.App.Page.NotFound.Controller, ['NotFoundView', '$BindPromise']);

};