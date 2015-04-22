import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

ns.namespace('App.Page.Home');

bootstrap.addComponent((utils) => {
	
	/**
	 * Home Page view.
	 *
	 * @class View
	 * @extends React.Component
	 * @namespace App.Page.Home
	 * @module App
	 * @submodule App.Page
	 *
	 * @uses App.Component.TextInput.View
	 * @uses App.Component.Feed.View
	 * @uses App.Component.Header.View
	 * @uses App.Component.Filter.View
	 */
	class View extends React.Component {

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
		}
	}

	ns.App.Page.Home.View = View;
});