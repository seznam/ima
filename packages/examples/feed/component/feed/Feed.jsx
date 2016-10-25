import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';
import FeedItem from 'app/component/feedItem/FeedItem';

/**
 * Feed of posted feed items.
 *
 * @class Feed
 * @extends ima.page.AbstractComponent
 * @namespace app.component.feed
 * @module app
 * @submodule app.component
 */
export default class Feed extends AbstractComponent {

	render() {
		return (
			<div className='feed'>
				{this._renderFeedItems(this.props.entity)}
			</div>
		);
	}

	_renderFeedItems(feedEntity) {
		if (!feedEntity) {
			return null;
		}

		let categories = this.props.categories;

		let items = feedEntity.getItems();
		let feedItems = items.map((item) => {
			let category = categories.getCategoryById(item.getCategoryId());

			return (
				<FeedItem
						key={item.getId()}
						entity={item}
						category={category}
						sharedItem={this.props.sharedItem}/>
			);
		}).reverse();

		return feedItems;
	}
}
