import ns from 'imajs/client/core/namespace';

ns.namespace('App.Model.ListItem');

class Entity {
	constructor(data) {
		Object.assign(this, data);

		this.id;

		this.title;

		this.completed;
	}
}

ns.App.Model.ListItem.Entity = Entity;
