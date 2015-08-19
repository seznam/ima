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

	onItemCreated(data) {
		data.completed = false;
		this._itemsService.add(data);

		this.patchState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}

	onToggleAll(data) {
		var state = this.getState();

		for (var item of state.items) {
			item.completed = data.completed;
			this._itemsService.update(item.id, item);
		}

		this.patchState({
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

		this.patchState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}

	onItemDeleted(data) {
		this._itemsService.delete(data.item.id);

		this.patchState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}

	onItemCompletionToggled(data) {
		var item = data.item;
		item.completed = !item.completed;
		this._itemsService.update(item.id, item);

		var items = this._itemsService.getAll(this.getState().filter);

		this.patchState({
			items: items,
			toggleAllChecked: items.every(item => item.completed)
		});
	}

	onItemEdited(data) {
		var {item, newTitle} = data;
		item.title = newTitle;
		this._itemsService.update(item.id, item);

		this.patchState({
			items: this._itemsService.getAll(this.getState().filter)
		});
	}
}

ns.App.Page.Home.Controller = Controller;
