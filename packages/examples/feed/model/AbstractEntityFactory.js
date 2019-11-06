/**
 * Base class for entity factories.
 */
export default class AbstractEntityFactory {
  /**
   * @param {function(new: AbstractEntity, Object<string, *>)} entityConstructor
   */
  constructor(entityConstructor) {
    /**
     * @type {function(new: AbstractEntity, Object<string, *>)}
     */
    this._entityConstructor = entityConstructor;
  }

  /**
   * Creates a list of entities from the provided data.
   *
   * @param {Object<string, *>[]} data
   * @return {AbstractEntity[]}
   */
  createEntityList(data) {
    let array = data;
    let entityList = [];

    for (let arrayData of array) {
      let entity = this.createEntity(arrayData);
      entityList.push(entity);
    }

    return entityList;
  }

  /**
   * Creates a new entity from the provided data.
   *
   * @param {Object<string, *>} data
   * @return {AbstractEntity}
   */
  createEntity(data) {
    return new this._entityConstructor(data);
  }
}
