import ns from 'ima/namespace';
import GenericError from 'ima/error/GenericError';
import BaseController from 'app/base/Controller';

ns.namespace('app.page.home');

export default class Controller extends BaseController {
	constructor(itemsService) {
		super();

		this._itemsService = itemsService;
	}

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
				throw new GenericError('Invalid URL', { status: 404 });
		}

		let items = this._itemsService.getAll(filter);

		return {
			items: items,
			filter: filter,
			toggleAllChecked: items.every(item => item.completed)
		};
	}

	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		let title = 'Isomorphic applications TODO list - IMA.js';
		let description = 'Demo example of TodoMVC. TodoMVC is a project ' +
				'which offers the same Todo application implemented using ' +
				'MV* concepts in most of the popular JavaScript MV* ' +
				'frameworks of today.';
		let image = router.getDomain() + settings.$Static.image +
				'/imajs-share.png';

		let url = router.getUrl();

		metaManager.setTitle(title);

		metaManager.setMetaName('description', description);
		metaManager.setMetaName(
			'keywords',
			'IMA.js, isomorphic application, javascript, TODO list'
		);

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
		let state = this.getState();

		for (let item of state.items) {
			item.completed = data.completed;
			this._itemsService.update(item.id, item);
		}

		this.setState({
			items: this._itemsService.getAll(state.filter),
			toggleAllChecked: data.completed
		});
	}

	onCompletedItemsDeleted() {
		let items = this.getState().items;
		for (let item of items) {
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
		let item = data.item;
		item.completed = !item.completed;
		this._itemsService.update(item.id, item);

		var items = this._itemsService.getAll(this.getState().filter);

		this.setState({
			items: items,
			toggleAllChecked: items.every(item => item.completed)
		});
	}

	onItemEdited(data) {
		let {item, newTitle} = data;
		item.title = newTitle;
		this._itemsService.update(item.id, item);

		this.setState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}
}

ns.app.page.home.Controller = Controller;
