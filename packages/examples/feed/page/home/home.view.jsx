import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Page.Home');

/**
 * HomePage view.
 *
 * @class View
 * @extends Core.Abstract.Component
 * @namespace App.Page.Home
 * @module App
 * @submodule App.Page
 *
 * @uses App.Component.Layout.Header.View
 * @uses App.Component.Layout.Main.View
 * @uses App.Component.Sign.List.View
 */
class View extends ns.Core.Abstract.Component {

	render() {

		var TextInput = ns.App.Component.TextInput.View;
		var Feed = ns.App.Component.Feed.View;
		var Header = ns.App.Component.Header.View;
		var Filter = ns.App.Component.Filter.View;

		return (
			<div className='l-homepage'>
				<Header $Utils={this.utils}/>
				<TextInput
						categories={this.props.categories}
						currentCategory={this.props.currentCategory}
						$Utils={this.utils}/>
				<Filter
						categories={this.props.categories}
						currentCategory={this.props.currentCategory}
						$Utils={this.utils}/>
				<Feed
						entity={this.props.feed}
						categories={this.props.categories}
						sharedItem={this.props.sharedItem}
						$Utils={this.utils}/>
			</div>
		);
	}
}

ns.App.Page.Home.View = View;
