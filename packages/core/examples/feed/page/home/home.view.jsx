import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.Home');
/**
 * HomePage view.
 *
 * @class View
 * @extends Core.Abstract.View
 * @namespace App.Page.Home
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
	 * @param {App.Page.Home.Controller} cotroller
	 * */
	init(controller) {
		super.init(controller);
		var self = this;

		this._view = this._React.createClass({
			mixins: [self._viewMixin],
			displayName: '',
			/* jshint ignore:start */
			render() {

				var TextInput = ns.App.Component.TextInput.View;
				var Feed = ns.App.Component.Feed.View;
				var Header = ns.App.Component.Header.View;
				var Filter = ns.App.Component.Filter.View;

				var filterExpanded = this.isFilterExpanded();

				var checkedCategory = this.getCheckedCategory();
				
				return (
					<div className='l-homepage'>
						<Header />
						<TextInput 
								categories={this.state.categories} 
								currentCategory={this.state.currentCategory} 
								checkedCategory={checkedCategory}/>
						<Filter
								categories={this.state.categories}
								currentCategory={this.state.currentCategory}
								expanded={filterExpanded} />
						<Feed
								entity={this.state.feed}
								categories={this.state.categories}
								sharedItem={this.state.sharedItem} />
					</div>
				);
			},
			/* jshint ignore:end */

			isFilterExpanded() {
				return this.state.filter && this.state.filter.expanded;
			},

			getCheckedCategory() {
				var currentCategory = this.state.currentCategory;
				var checkedCategory = this.state.textInputCheckedCategory;
				
				if (currentCategory) {
					return currentCategory;
				}
				
				if (checkedCategory) {
					return checkedCategory;
				}
				
				if (this.state.categories) {
					return this.state.categories.getCategories()[0];
				}

				return null;
			}
		});

		return this;
	}
}

ns.App.Page.Home.View = View;
