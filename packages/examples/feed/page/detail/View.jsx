import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.page.detail');

/**
 * DetailPage view.
 *
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.page.detail
 * @module app
 * @submodule app.page
 */
class View extends AbstractComponent {

	render() {
		let Header = ns.app.component.header.View;

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
		if (entity && category) {
			let FeedItem = ns.app.component.feedItem.View;

			return (
				<FeedItem
						key={'item' + entity.getId()}
						entity={entity}
						category={category}
						singleItem='true'
						sharedItem={entity}
						$Utils={this.utils}/>
			);
		}
		return '';
	}

	getMoreItemButton() {
		let buttonTitle = this.utils.$Dictionary.get('detail.moreItemsButtonTitle');
		let link = this.utils.$Dictionary.get('detail.moreItemsButtonLink');

		return <a href={link} id='more-items-button' className='more-items button'>{buttonTitle}</a>;
	}
}

View.contextTypes = {
	$Utils: React.PropTypes.object
};

ns.app.page.detail.View = View;
