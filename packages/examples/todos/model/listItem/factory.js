import ns from 'imajs/client/core/namespace';

ns.namespace('App.Model.ListItem');

class Factory {
	createEntity(data) {
		var Entity = ns.App.Model.ListItem.Entity;
		return new Entity(data);
	}

	createEntityList(data) {
		return data.map(entityData => this.createEntity(entityData));
	}
}

ns.App.Model.ListItem.Factory = Factory;
