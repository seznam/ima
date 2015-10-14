import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';

ns.namespace('App.Page.Home');

class Controller extends ns.App.Base.Controller {
	constructor(itemsService) {
		super();

		this._itemsService = itemsService;
	}

	init() {}

	load() {
		var filter;
		switch (this.params.filter) {
			case 'active':
				filter = false;
				break;
			case 'completed':
				filter = true;
				break;
			case undefined:
				filter = null;
				break;
			default:
				throw new IMAError('Invalid URL', {status: 404});
		}

		var items = this._itemsService.getAll(filter);

		return {
			items: items,
			filter: filter,
			toggleAllChecked: items.every(item => item.completed)
		};
	}

	activate() {}

	destroy() {}

	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		var title = 'Isomorphic applications TODO list - IMA.js';
		var description = 'Demo example of TodoMVC. TodoMVC is a project which offers the same Todo application implemented using MV* concepts in most of the popular JavaScript MV* frameworks of today.';
		var image = router.getDomain() + settings.$Static.image + '/imajs-share.png';

		var url = router.getUrl();

		metaManager.setTitle(title);

		metaManager.setMetaName('description', description);
		metaManager.setMetaName('keywords', 'IMA.js, isomorphic application, javascript, TODO list');

		metaManager.setMetaName('twitter:title', title);
		metaManager.setMetaName('twitter:description', description);
		metaManager.setMetaName('twitter:card', 'summary');
		metaManager.setMetaName('twitter:image', image);
		metaManager.setMetaName('twitter:url', url);

		metaManager.setMetaProperty('og:title', title);
		metaManager.setMetaProperty('og:description', description);
		metaManager.setMetaProperty('og:type', 'website');
		metaManager.setMetaProperty('og:image', image);
		metaManager.setMetaProperty('og:url', url);
	}

	onItemCreated(data) {
		data.completed = false;
		this._itemsService.add(data);

		this.setState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}

	onToggleAll(data) {
		var state = this.getState();

		for (var item of state.items) {
			item.completed = data.completed;
			this._itemsService.update(item.id, item);
		}

		this.setState({
			items: this._itemsService.getAll(state.filter),
			toggleAllChecked: data.completed
		});
	}

	onCompletedItemsDeleted() {
		var items = this.getState().items;
		for (var item of items) {
			if (item.completed) {
				this._itemsService.delete(item.id);
			}
		}

		this.setState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}

	onItemDeleted(data) {
		this._itemsService.delete(data.item.id);

		this.setState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}

	onItemCompletionToggled(data) {
		var item = data.item;
		item.completed = !item.completed;
		this._itemsService.update(item.id, item);

		var items = this._itemsService.getAll(this.getState().filter);

		this.setState({
			items: items,
			toggleAllChecked: items.every(item => item.completed)
		});
	}

	onItemEdited(data) {
		var {item, newTitle} = data;
		item.title = newTitle;
		this._itemsService.update(item.id, item);

		this.setState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}
}

ns.App.Page.Home.Controller = Controller;
