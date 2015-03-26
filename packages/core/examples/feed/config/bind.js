export var init = (ns) => {

	//*************START CONSTANT**************
	ns.oc.bind('BASE_URL', ns.Setting.$Http.baseUrl);
	ns.oc.bind('CATEGORIES_API_URL', ns.Setting.Api.categories);
	ns.oc.bind('ITEMS_API_URL', ns.Setting.Api.items);
	ns.oc.bind('DEFAULT_PORTAL_ICON', ns.Setting.Images.defaultCategoryListIcon);
	//*************END CONSTANT****************

	// Our fake http handler for demo. You can use superagent (It's binded in IMA.js Core like '$Http') instead of fakeHttp.
	ns.oc.bind('FakeHttp', ns.oc.make('App.Module.FakeHttp', ['$BindPromise']));

	// Category Module
	ns.oc.bind('CategoryEntity', ns.App.Module.Category.Entity);
	ns.oc.bind('CategoryFactory', ns.oc.make('App.Module.Category.Factory', []));

	//CategoryList Module
	ns.oc.bind('CategoryListEntity', ns.App.Module.CategoryList.Entity);
	ns.oc.bind('CategoryListFactory', ns.oc.make('App.Module.CategoryList.Factory', ['CategoryFactory']));
	ns.oc.bind('CategoryListResource', ns.oc.make('App.Module.CategoryList.Resource', ['FakeHttp', 'BASE_URL', 'CATEGORIES_API_URL', 'CategoryListFactory', '$Cache']));
	ns.oc.bind('CategoryListService', ns.oc.make('App.Module.CategoryList.Service', ['CategoryListResource']));

	// Item Module
	ns.oc.bind('ItemEntity', ns.App.Module.Item.Entity);
	ns.oc.bind('ItemFactory', ns.oc.make('App.Module.Item.Factory', []));
	ns.oc.bind('ItemResource', ns.oc.make('App.Module.Item.Resource', ['FakeHttp', 'BASE_URL', 'ITEMS_API_URL', 'ItemFactory', '$Cache']));
	ns.oc.bind('ItemService', ns.oc.make('App.Module.Item.Service', ['ItemResource']));

	// Feed Module	
	ns.oc.bind('FeedEntity', ns.App.Module.Feed.Entity);
	ns.oc.bind('FeedFactory', ns.oc.make('App.Module.Feed.Factory', ['ItemFactory']));
	ns.oc.bind('FeedResource', ns.oc.make('App.Module.Feed.Resource', ['FakeHttp', 'BASE_URL', 'ITEMS_API_URL', 'FeedFactory', '$Cache']));
	ns.oc.bind('FeedService', ns.oc.make('App.Module.Feed.Service', ['FeedResource']));
	
	// Page Home
	ns.oc.bind('HomeView', ns.App.Page.Home.View, ['$BindReact']);
	ns.oc.bind('HomeController', ns.App.Page.Home.Controller, ['HomeView', 'FeedService', 'CategoryListService', 'ItemResource', '$Dispatcher', '$Dictionary']);

	// Page Detail
	ns.oc.bind('DetailView', ns.App.Page.Detail.View, ['$BindReact']);
	ns.oc.bind('DetailController', ns.App.Page.Detail.Controller, ['DetailView', 'ItemService', 'CategoryListService', '$Dispatcher', '$Dictionary']);

	// Page Error
	ns.oc.bind('ErrorView', ns.App.Page.Error.View, ['$BindReact']);
	ns.oc.bind('ErrorController', ns.App.Page.Error.Controller, ['ErrorView', '$BindPromise']);

	// Page Not Found
	ns.oc.bind('NotFoundView', ns.App.Page.NotFound.View, ['$BindReact']);
	ns.oc.bind('NotFoundController', ns.App.Page.NotFound.Controller, ['NotFoundView', '$BindPromise']);

};