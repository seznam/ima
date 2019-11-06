import AbstractController from 'app/page/AbstractController';
import CategoryListService from 'app/model/categoryList/CategoryListService';
import FeedService from 'app/model/feed/FeedService';
import ItemResource from 'app/model/item/ItemResource';

/**
 * Controller for the home page, with both enabled and disabled filtering.
 */
export default class HomeController extends AbstractController {
  static get $dependencies() {
    return [FeedService, CategoryListService, ItemResource];
  }

  /**
   * Initializes the home page controller.
   *
   * @param {FeedService} feedService
   * @param {CategoryListService} categoryListService
   * @param {ItemResource} itemResource
   */
  constructor(feedService, categoryListService, itemResource) {
    super();

    /**
     * Service providing the list of feed items loaded from the REST API.
     *
     * @type {FeedService}
     */
    this._feedService = feedService;

    /**
     * Service providing the list of categories loaded from the REST API.
     *
     * @type {CategoryListService}
     */
    this._categoryListService = categoryListService;

    /**
     * Item resource for creating new item entities.
     *
     * @type {ItemResource}
     */
    this._itemResource = itemResource;
  }

  /**
   * Load all needed data.
   *
   * @return {Object<string, *>} object of promise
   */
  load() {
    return {
      categories: this._categoryListService.load(),
      currentCategory: this._categoryListService.getCategoryByUrl(
        this.params.category
      ),
      feed: this._feedService.load(this.params.category),
      sharedItem: null
    };
  }

  /**
   * Event handler for the {@code sharetoggle} event fired by the Share
   * component.
   *
   * The handler first checks whether the feed item for which sharing has
   * been toggles is the feed item for which the sharing options are
   * currently displayed.
   *
   * In such case, the handler resets the sharedItem state field of this
   * controller, which results in hiding the sharing UI.
   *
   * If the event is fired for a different feed item, the handler sets the
   * sharedItem state field of this controller to the new feed item, which
   * results in hiding the sharing UI of the previosly selected feed item (if
   * any), and showing the sharing UI for the newly selected feed item.
   *
   * @param {Object} event The event fired by the Share component.
   */
  onShareToggle(event) {
    let state = this.getState();

    if (state.sharedItem === event.item) {
      state.sharedItem = null;
    } else {
      state.sharedItem = event.item;
    }

    this.setState(state);
  }

  /**
   * Button click handler for add new item to feed.
   * It creates new item entity and adds it to feed.
   *
   * @param {Object} data
   */
  onAddItemToFeed(data) {
    this._itemResource.createEntity(data).then(item => {
      let state = this.getState();
      this._feedService.addItemToFeed(state.feed, item);
      this.setState(state);
    });
  }
}
