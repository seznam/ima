import Resource from './ListItemResource';
import ListItemFactory from './ListItemFactory';

export default class Service {
  static get $dependencies() {
    return [Resource, ListItemFactory];
  }

  constructor(resource, factory) {
    this._resource = resource;

    this._factory = factory;
  }

  getAll(completed) {
    let data = this._resource.getAll(completed);
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
