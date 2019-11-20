import AbstractEntityFactory from 'app/model/AbstractEntityFactory';
import ItemEntity from 'app/model/item/ItemEntity';

/**
 * Factory  to create item entity.
 */
export default class ItemFactory extends AbstractEntityFactory {
  static get $dependencies() {
    return [];
  }

  constructor() {
    super(ItemEntity);
  }
}
