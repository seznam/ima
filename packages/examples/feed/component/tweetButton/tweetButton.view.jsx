import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

const POPUP_SIZE = Object.freeze({
	width: 550,
	height: 443
});

ns.namespace('App.Component.TweetButton');

/**
 * React component providing the UI for sharing feed items using social media
 * and e-mail.
 *
 * @class View
 * @namespace App.Component.TweetButton
 * @module App
 * @submodule App.Component
 */

class View extends ns.Core.Abstract.Component {

	constructor(props) {
		super(props);
	}

	/**
	 * Renders the component.
	 *
	 * @method render
	 * @return {*} The component's UI.
	 */
	render() {
		var link = this.composeUrl();

		return (
			<a
					href={link}
					onClick={(e)=>this.onShare(e)}
					className='tweet-button'
					target='_blank'>
				<img
						src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/share/twitter.png'}
						alt={this.props.label} />
				{this.props.label}
			</a>
		);
	}

	/**
	 * Event handler for the click on the "share via Twitter" button.
	 *
	 * The handler attemps to opens a new popup for sharing the feed item on
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
	 * only if the popup is successfuly shown. If the browser blocks the popup,
	 * the default action will not be blocked and the broser will follow the
	 * link of the anchor.
	 *
	 * @method onShare
	 * @param {SyntheticEvent} event The event wrapper by React.
	 */
	onShare(event) {
		var url = this.composeUrl();
		var options = {
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

		var optionsString = Object.keys(options).map((optionName) => {
			return [optionName, options[optionName]].
					map(encodeURIComponent).
					join('=');
		});

		var openedWindow = window.open(url, 'twitter', optionsString);

		if (openedWindow) {
			event.preventDefault();
		}
	}

	/**
	 * Composes the URL to the Twitter sharing API containing the parameters
	 * neccessary for sharing the current feed item.
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
		var query = {
			url: this.props.url,
			text: this.props.text,
			hashtags: this.props.hashTags.replace('#', '')
		};

		var queryString = Object.keys(query)
			.map((parameterName) => {
				return [
					parameterName,
					query[parameterName]
				].map(encodeURIComponent).join('=');
			}).join('&');

		return `https://twitter.com/share?${queryString}`;
	}
}

ns.App.Component.TweetButton.View = View;
