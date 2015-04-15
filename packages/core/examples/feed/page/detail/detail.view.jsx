import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';

ns.namespace('App.Page.Detail');
/**
 * DetailPage view.
 *
 * @class View
 * @extends Core.Abstract.View
 * @namespace App.Page.Detail
 * @module App
 * @submodule App.Page
 *
 * @uses App.Component.Layout.Header.View
 * @uses App.Component.Layout.Main.View
 * @uses App.Component.Sign.List.View
 */
class View extends ns.Core.Abstract.View {

	/*
	* @method constructor
	* @constructor
	* @param {Vendor.React} React
	* */
	constructor(React) {
		super(React);
	}

	/**
	 * Initialization view.
	 *
	 * @method init
	 * @param {App.Page.Detail.Controller} cotroller
	 * */
	init(controller) {
		super.init(controller);
		var self = this;

		this._view = this._React.createClass({
			mixins: [self._viewMixin],
			displayName: '',
			/* jshint ignore:start */
			render() {
				var Header = ns.App.Component.Header.View;

				var entity = this.state.item;
				var category = this.state.category;
				var item = this.getItem(entity, category);
				var moreItemsButton = this.getMoreItemButton();
				
				return (
					<div className='l-detailpage'>
						<Header/>
						<div className='detail'>
							{item}
							{moreItemsButton}
						</div>
					</div>
				);
			},

			getItem(entity, category) {

				if (entity && category) {
					var FeedItem = ns.App.Component.FeedItem.View;

					return (
						<FeedItem
							key={'item'+entity.getId()}
							entity={entity}
							category={category}
							singleItem='true'
							sharedItem={entity} />
					);
				}
				return '';
			},

			getMoreItemButton() {
				var dictionary = oc.get('$Dictionary');
				var buttonTitle = dictionary.get('detail.moreItemsButtonTitle');
				var link = dictionary.get('detail.moreItemsButtonLink');

				return <a href={link} id='more-items-button' className='more-items button'>{buttonTitle}</a>
			}
			/* jshint ignore:end */
		});

		return this;
	}
}

ns.App.Page.Detail.View = View;
