import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.component.feedItem');

/**
 * Feed writing.
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.component.feedItem
 * @module app
 * @submodule app.component
 */
class View extends AbstractComponent {

	constructor(props) {
		super(props);
	}

	render() {
		let DateComponentDiv = ns.app.component.date.View;
		let ShareDiv = ns.app.component.share.View;

		let entity = this.props.entity;
		let category = this.props.category;

		let sharedItemActive = this.props.sharedItem === entity;
		let singleItemClass = this.props.singleItem ? ' single-item' : '';

		let icon = this.getIcon(category);
		let hashTag = this.getHashTag(category);

		return (
			<div className={'feed-item' + singleItemClass}>
				{icon}
				<div className='content-wrapper'>
					<div
							className='content'
							dangerouslySetInnerHTML={{ __html: entity.getContent() }}/>
					<div className='toolbar'>
						{hashTag}
						<DateComponentDiv
								date={entity.getPosted()}
								$Utils={this.utils}/>
						<ShareDiv
								item={entity}
								category={category}
								active={sharedItemActive}
								$Utils={this.utils}/>
					</div>
				</div>
			</div>
		);
	}

	getIcon(category) {
		if (category) {
			return (
				<div className='service-icon'>
					<img src={this.utils.$Router.getBaseUrl() + category.getIconUrl()} alt={category.getName()} />
				</div>);
		}

		return '';
	}

	getHashTag(category) {
		if (category) {
			let link = this.utils.$Router.link('category', { category: category.getUrlName() });

			return (
				<a href={link}>{category.getHashTag()}</a>
			);
		}

		return '';
	}
}

ns.app.component.feedItem.View = View;
