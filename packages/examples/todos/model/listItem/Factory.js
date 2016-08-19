import Entity from './Entity';

export default class Factory {
	createEntity(data) {
		return new Entity(data);
	}

	createEntityList(data) {
		return data.map(entityData => this.createEntity(entityData));
	}
}
