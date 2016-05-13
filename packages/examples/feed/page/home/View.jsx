import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.page.home');

/**
 * HomePage view.
 *
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.page.home
 * @module app
 * @submodule app.page
 */
class View extends AbstractComponent {

	render() {

		var TextInput = ns.app.component.textInput.View;
		var Feed = ns.app.component.feed.View;
		var Header = ns.app.component.header.View;
		var Filter = ns.app.component.filter.View;

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

View.contextTypes = {
	$Utils: React.PropTypes.object
};

ns.app.page.home.View = View;
