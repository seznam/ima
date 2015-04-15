import ns from 'imajs/client/core/namespace.js';

var boot = ns.oc.get('$Boot');

boot.addComponent(() => {

	ns.namespace('App.Component.Feed');

	/**
	 * Feed writing.
	 * @class View
	 * @namespace App.Component.Feed
	 * @module App
	 * @submodule Component
	 */
	/* jshint ignore:start */
	ns.App.Component.Feed.View = React.createClass({
		render() {
			
			var entity = this.props.entity;
			var Items = this.getFeedItems(entity);

			return (
				<div className='feed'>
					{Items}
				</div>
			);
		},

		getFeedItems(entity) {
			if (entity) {
				var FeedItem = ns.App.Component.FeedItem.View;

				var categories = this.props.categories;

				var items = entity.getItems();
				var FeedItems = items.map((item) => {

					var category = categories.getCategoryById(item.getCategoryId());

					return (
						<FeedItem
								key={'item'+item.getId()}
								entity={item}
								category={category}
								sharedItem={this.props.sharedItem}/>
					);
				}).reverse();
				return FeedItems;
			} else {
				return null;
			}
		},

		getMoreItems() {
			var entity = this.props.entity;
			if (entity) {
				ns.oc.get('$Dispatcher').fire('getmoreitems');
			}
		}
	});
	/* jshint ignore:end */
});
