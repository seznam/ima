import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

const POPUP_SIZE = Object.freeze({
	width: 550,
	height: 443
});

/**
 * React component providing the UI for sharing feed items using the Twitter
 * social network.
 *
 * @class TweetButton
 * @extends AbstractComponent
 * @namespace app.component.tweetButton
 * @module app
 * @submodule app.component
 */

export default class TweetButton extends AbstractComponent {

	render() {
		return (
			<a
					href={this.composeUrl()}
					onClick={event => this.onShare(event)}
					className='tweet-button'
					target='_blank'>
				<img
						src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/share/twitter.png'}
						alt={this.props.label}/>
				{this.props.label}
			</a>
		);
	}

	/**
	 * Event handler for the click on the "share via Twitter" button.
	 *
	 * The handler attempts to opens a new popup for sharing the feed item on
	 * the Twitter. The popup will be properly sized and centered on the
	 * screen, with no utility bars or menus being shown. The popup will be
	 * resizable and will have its scrollbars enabled.
	 *
	 * The popup will have its dependent flag enabled, meaning that (if
	 * supported by the current browser), it will be closed automatically if
	 * the browser window/tab with the page is closed, and will be minified to
	 * the task bar if the window with the page is minified.
	 *
	 * The handler will prevent the default browser action (following the link)
	 * only if the popup is successfully shown. If the browser blocks the popup,
	 * the default action will not be blocked and the browser will follow the
	 * link of the anchor.
	 *
	 * @method onShare
	 * @param {Event} event The click event.
	 */
	onShare(event) {
		let url = this.composeUrl();
		let options = {
			left: Math.floor((screen.width - POPUP_SIZE.width) / 2),
			top: Math.floor((screen.height - POPUP_SIZE.height) / 2),
			width: POPUP_SIZE.width,
			height: POPUP_SIZE.height,
			menubar: 0,
			toolbar: 0,
			location: 0,
			personalbar: 0,
			status: 0,
			dependent: 1,
			dialog: 1,
			resizable: 1,
			scrollbars: 1
		};

		let optionsString = Object.keys(options).map((optionName) => {
			return [optionName, options[optionName]]
					.map(encodeURIComponent)
					.join('=');
		});

		let openedWindow = window.open(url, 'twitter', optionsString);

		if (openedWindow) {
			event.preventDefault();
		}
	}

	/**
	 * Composes the URL to the Twitter sharing API containing the parameters
	 * necessary for sharing the current feed item.
	 *
	 * The methods expects the following properties set on this React
	 * component:
	 * - url - The canonical URL to the feed item.
	 * - text - The text to be shared via the tweet.
	 * - hashTags - hash tags separated by commas to share with the tweet.
	 *
	 * @method composeUrl
	 * @return {string} The full absolute URL to use for sharing the feed item
	 *         on the Twitter.
	 */
	composeUrl() {
		let query = {
			url: this.props.url,
			text: this.props.text,
			hashtags: this.props.hashTags.replace('#', '')
		};

		let queryString = Object.keys(query)
			.map((parameterName) => {
				return [
					parameterName,
					query[parameterName]
				].map(encodeURIComponent).join('=');
			}).join('&');

		return `https://twitter.com/share?${queryString}`;
	}
}
