import Entity from './ListItemEntity';

export default class Factory {
  static get $dependencies() {
    return [];
  }

  createEntity(data) {
    return new Entity(data);
  }

  createEntityList(data) {
    return data.map(entityData => this.createEntity(entityData));
  }
}
