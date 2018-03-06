import AbstractService from 'app/model/AbstractService';
import CategoryListService from 'app/model/categoryList/CategoryListService';
import FeedResource from 'app/model/feed/FeedResource';

/**
 * Class for the feed model.
 * It's a model of the feed model.
 */
export default class FeedService extends AbstractService {
  static get $dependencies() {
    return [FeedResource, CategoryListService];
  }

  /**
   * @param {FeedResource} feedResource
   * @param {CategoryListService} categoryListService
   */
  constructor(feedResource, categoryListService) {
    super(feedResource);

    /**
     * @type {CategoryListService}
     */
    this._categoryListService = categoryListService;
  }

  /**
   * Returns last item entity.
   *
   * @param {FeedEntity} feedEntity
   * @return {?ItemEntity}
   */
  getLastItem(feedEntity) {
    if (feedEntity && feedEntity.getItems().length) {
      let items = feedEntity.getItems();

      return items[0];
    }

    return null;
  }

  /**
   * @param {?string=} [currentCategory=null]
   * @return {Promise<FeedEntity>}
   */
  load(currentCategory = null) {
    return this._categoryListService
      .getCategoryByUrl(currentCategory)
      .then(categoryEntity => {
        return this._resource.getEntity(categoryEntity);
      });
  }

  /**
   * Adds new item to feed.
   *
   * @param {FeedEntity} feedEntity
   * @param {ItemEntity} itemEntity
   * @return {FeedEntity}
   */
  addItemToFeed(feedEntity, itemEntity) {
    let items = feedEntity.getItems();
    items.push(itemEntity);
    feedEntity.setItems(items);

    return feedEntity;
  }
}
