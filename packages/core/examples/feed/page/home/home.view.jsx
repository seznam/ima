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
	 * @param {Object} utils
	 */
	constructor(React, utils) {
		super(React, utils);
	}

	/**
	 * Initialization view.
	 *
	 * @method init
	 * @param {function()} getInitializationState
	 */
	init(getInitializationState) {
		super.init(getInitializationState);
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
				
				return (
					<div className='l-homepage'>
						<Header />
						<TextInput 
								categories={this.state.categories} 
								currentCategory={this.state.currentCategory} />
						<Filter
								categories={this.state.categories}
								currentCategory={this.state.currentCategory} />
						<Feed
								entity={this.state.feed}
								categories={this.state.categories}
								sharedItem={this.state.sharedItem} />
					</div>
				);
			},
			/* jshint ignore:end */
		});

		return this;
	}
}

ns.App.Page.Home.View = View;
