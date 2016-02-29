import ns from 'ima/namespace';
import Entity from './entity';

ns.namespace('app.model.listItem');

export default class Factory {
	createEntity(data) {
		return new Entity(data);
	}

	createEntityList(data) {
		return data.map(entityData => this.createEntity(entityData));
	}
}

ns.app.model.listItem.Factory = Factory;
