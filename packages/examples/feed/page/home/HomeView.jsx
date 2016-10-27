import AbstractComponent from 'ima/page/AbstractComponent';
import React, { PropTypes } from 'react';
import Feed from 'app/component/feed/Feed';
import Filter from 'app/component/filter/Filter';
import Header from 'app/component/header/Header';
import TextInput from 'app/component/textInput/TextInput';

/**
 * HomePage view.
 */
export default class HomeView extends AbstractComponent {

	static get contextTypes() {
		return {
			$Utils: PropTypes.object
		};
	}

	render() {
		return (
			<div className='l-homepage'>
				<Header/>
				<TextInput
						categories={this.props.categories}
						currentCategory={this.props.currentCategory}/>
				<Filter
						categories={this.props.categories}
						currentCategory={this.props.currentCategory}/>
				<Feed
						entity={this.props.feed}
						categories={this.props.categories}
						sharedItem={this.props.sharedItem}/>
			</div>
		);
	}
}
