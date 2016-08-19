import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.component.feed');

/**
 * Feed writing.
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.component.Feed
 * @module app
 * @submodule app.component
 */
class View extends AbstractComponent {

	constructor(props) {
		super(props);
	}

	render() {
		let entity = this.props.entity;
		let Items = this.getFeedItems(entity);

		return (
			<div className='feed'>
				{Items}
			</div>
		);
	}

	getFeedItems(entity) {
		if (entity) {
			let FeedItem = ns.app.component.feedItem.View;

			let categories = this.props.categories;

			let items = entity.getItems();
			let FeedItems = items.map((item) => {

				let category = categories.getCategoryById(item.getCategoryId());

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

ns.app.component.feed.View = View;
