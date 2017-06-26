import Cache from 'ima/cache/Cache';
import Dictionary from 'ima/dictionary/Dictionary';
import EventBus from 'ima/event/EventBus';
import Router from 'ima/router/Router';
import Window from 'ima/window/Window';
import MockHttpAgent from 'app/mock/MockHttpAgent';
import CategoryListFactory from 'app/model/categoryList/CategoryListFactory';
import CategoryListResource from 'app/model/categoryList/CategoryListResource';
import FeedFactory from 'app/model/feed/FeedFactory';
import FeedResource from 'app/model/feed/FeedResource';
import ItemFactory from 'app/model/item/ItemFactory';
import ItemResource from 'app/model/item/ItemResource';

export default (ns, oc, config) => {

	//*************START CONSTANT**************
	oc.constant('API_BASE_URL', config.Api.baseUrl);
	oc.constant('CATEGORIES_API_URL', config.Api.baseUrl + config.Api.categories);
	oc.constant('ITEMS_API_URL', config.Api.baseUrl + config.Api.items);
	//*************END CONSTANT****************

	// Our fake http handler for demo. You can use superagent (It's binded in IMA.js Core like '$Http') instead of fakeHttp.
	oc.bind('$Http', MockHttpAgent, ['API_BASE_URL']);

	oc.inject(CategoryListResource, ['$Http', 'CATEGORIES_API_URL', CategoryListFactory, Cache]);
	oc.inject(FeedResource, ['$Http', 'ITEMS_API_URL', FeedFactory, Cache]);
	oc.inject(ItemResource, ['$Http', 'ITEMS_API_URL', ItemFactory, Cache]);

	// Component utils
	oc.constant('$Utils', {
		$Router: oc.get(Router),
		$Dictionary: oc.get(Dictionary),
		$EventBus: oc.get(EventBus),
		$Settings: oc.get('$Settings'),
		$Window: oc.get(Window),
		$CssClasses: oc.get('$CssClasses')
	});
};
