import PropTypes from 'prop-types';
import React from 'react';
import AbstractComponent from 'ima/page/AbstractComponent';
import FeedItem from 'app/component/feedItem/FeedItem';
import Header from 'app/component/header/Header';

/**
 * DetailPage view.
 */
export default class DetailView extends AbstractComponent {

	static get contextTypes() {
		return {
			$Utils: PropTypes.object
		};
	}

	render() {
		let entity = this.props.item;
		let category = this.props.category;
		let item = this.getItem(entity, category);
		let moreItemsButton = this.getMoreItemButton();

		return (
			<div className='l-detailpage'>
				<Header $Utils={this.utils}/>
				<div className='detail'>
					{item}
					{moreItemsButton}
				</div>
				<div id="right_column">
				</div>
			</div>
		);
	}

	getItem(entity, category) {
		if (!entity || !category) {
			return null;
		}

		return (
			<FeedItem
					key={entity.getId()}
					entity={entity}
					category={category}
					singleItem={true}
					sharedItem={entity}
					$Utils={this.utils}/>
		);
	}

	getMoreItemButton() {
		let buttonTitle = this.localize('detail.moreItemsButtonTitle');
		let link = this.localize('detail.moreItemsButtonLink');

		return (
			<a href={link} id='more-items-button' className='more-items button'>
				{buttonTitle}
			</a>
		);
	}
}
