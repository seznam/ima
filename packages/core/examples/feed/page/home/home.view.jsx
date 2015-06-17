import ns from 'imajs/client/core/namespace.js';
import AbstractComponent from 'imajs/client/core/abstract/viewComponent.js';

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
class View extends AbstractComponent {

	constructor(props) {
		super(props);

		this.state = props;
	}

	render() {

		var TextInput = ns.App.Component.TextInput.View;
		var Feed = ns.App.Component.Feed.View;
		var Header = ns.App.Component.Header.View;
		var Filter = ns.App.Component.Filter.View;

		return (
			<div className='l-homepage'>
				<Header $Utils={this.utils}/>
				<TextInput 
						categories={this.state.categories} 
						currentCategory={this.state.currentCategory}
						$Utils={this.utils}/>
				<Filter
						categories={this.state.categories}
						currentCategory={this.state.currentCategory}
						$Utils={this.utils}/>
				<Feed
						entity={this.state.feed}
						categories={this.state.categories}
						sharedItem={this.state.sharedItem}
						$Utils={this.utils}/>
			</div>
		);
	}
}

ns.App.Page.Home.View = View;
