import ns from 'ima/namespace';

ns.namespace('app.model.listItem');

export default class Entity {
	constructor(data) {
		Object.assign(this, data);

		this.id;

		this.title;

		this.completed;
	}
}

ns.app.model.listItem.Entity = Entity;
