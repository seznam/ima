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
		var DateComponentDiv = ns.app.component.date.View;
		var ShareDiv = ns.app.component.share.View;

		var entity = this.props.entity;
		var category = this.props.category;

		var sharedItemActive = this.props.sharedItem === entity;
		var singleItemClass = this.props.singleItem ? ' single-item' : '';

		var icon = this.getIcon(category);
		var hashTag = this.getHashTag(category);

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
			var link = this.utils.$Router.link('category', { category: category.getUrlName() });

			return (
				<a href={link}>{category.getHashTag()}</a>
			);
		}

		return '';
	}
}

ns.app.component.feedItem.View = View;
