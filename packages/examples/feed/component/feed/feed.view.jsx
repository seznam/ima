import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Component.Feed');

/**
 * Feed writing.
 * @class View
 * @namespace App.Component.Feed
 * @module App
 * @submodule Component
 */
class View extends ns.Core.Abstract.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var entity = this.props.entity;
		var Items = this.getFeedItems(entity);

		return (
			<div className='feed'>
				{Items}
			</div>
		);
	}

	getFeedItems(entity) {
		if (entity) {
			var FeedItem = ns.App.Component.FeedItem.View;

			var categories = this.props.categories;

			var items = entity.getItems();
			var FeedItems = items.map((item) => {

				var category = categories.getCategoryById(item.getCategoryId());

				return (
					<FeedItem
							key={'item' + item.getId()}
							entity={item}
							category={category}
							sharedItem={this.props.sharedItem}
							$Utils={this.utils}/>
				);
			}).reverse();
			return FeedItems;
		} else {
			return null;
		}
	}
}

ns.App.Component.Feed.View = View;
