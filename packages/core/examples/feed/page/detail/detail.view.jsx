import ns from 'imajs/client/core/namespace.js';
import AbstractComponent from 'imajs/client/core/abstract/component.js';

ns.namespace('App.Page.Detail');

/**
 * DetailPage view.
 *
 * @class View
 * @extends Core.Abstract.Component
 * @namespace App.Page.Detail
 * @module App
 * @submodule App.Page
 *
 * @uses App.Component.Layout.Header.View
 * @uses App.Component.Layout.Main.View
 * @uses App.Component.Sign.List.View
 */
class View extends AbstractComponent {

	constructor(props) {
		super(props);

		this.state = props;
	}

	render() {
		var Header = ns.App.Component.Header.View;

		var entity = this.state.item;
		var category = this.state.category;
		var item = this.getItem(entity, category);
		var moreItemsButton = this.getMoreItemButton();
		
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
			var FeedItem = ns.App.Component.FeedItem.View;

			return (
				<FeedItem
						key={'item'+entity.getId()}
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
		var buttonTitle = this.utils.$Dictionary.get('detail.moreItemsButtonTitle');
		var link = this.utils.$Dictionary.get('detail.moreItemsButtonLink');

		return <a href={link} id='more-items-button' className='more-items button'>{buttonTitle}</a>
	}
}

ns.App.Page.Detail.View = View;
