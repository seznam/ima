import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Component.FeedItem');

/**
 * Feed writing.
 * @class View
 * @namespace App.Component.FeedItem
 * @module App
 * @submodule App.Component
 */
class View extends ns.Core.Abstract.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var DateComponentDiv = ns.App.Component.Date.View;
		var ShareDiv = ns.App.Component.Share.View;

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

ns.App.Component.FeedItem.View = View;
