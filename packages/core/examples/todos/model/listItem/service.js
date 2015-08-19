import ns from 'imajs/client/core/namespace';

ns.namespace('App.Model.ListItem');

class Service {
	constructor(resource, factory) {
		this._resource = resource;

		this._factory = factory;
	}

	getAll(completed) {
		var data = this._resource.getAll(completed);
		return this._factory.createEntityList(data);
	}

	add(data) {
		this._resource.add(data);
		return this._factory.createEntity(data);
	}

	update(id, entity) {
		this._resource.update(id, entity);
	}

	delete(id) {
		this._resource.delete(id);
	}
}

ns.App.Model.ListItem.Service = Service;
