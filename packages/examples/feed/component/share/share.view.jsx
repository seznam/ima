import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Component.Share');

/**
 * React component providing the UI for sharing feed items using social media
 * and e-mail.
 *
 * @class View
 * @namespace App.Component.Share
 * @module App
 * @submodule App.Component
 */
class View extends ns.Core.Abstract.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var label = this.utils.$Dictionary.get('home.share');

		var TwitterButton = ns.App.Component.TweetButton.View;

		var item = this.props.item;
		var category = this.props.category;

		var active = this.props.active ? ' expanded' : '';
		var postLink = this.getPostLink(item, category);

		return (
			<div className={'share' + (active)}>
				<a href={postLink} className='toggle' onClick={(e) => this.onToggle(e)}>{label}</a>
				<div className='sharing-wrapper'>
					<div className='sharing-container'>
						<div className='arrow'></div>
						<div className='arrow-overlay'></div>
						<div className='sharing-options'>
							<input
									type='text'
									value={postLink}
									readOnly={true}
									ref='shareLink'
									onClick={(e)=>this.selectShareLink(e)}/>

							<a
									href={postLink}
									onClick={(e)=>this.onShareOnFacebook(e)}
									className='facebook'>
								<img
										src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/share/facebook.png'}
										alt='Facebook' />
								Facebook
							</a>

							<TwitterButton
									label='Twitter'
									url={postLink}
									text={this.getPlainTextItemContent(item)}
									hashTags={category.getHashTag()}
									$Utils={this.utils}/>

							<a href={this.getMailShareLink(item)} className='email'>
								<img
										src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/share/email.png'}
										alt='Email' />
								Email
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}

	onShareOnFacebook(event) {
		event.preventDefault();
		event.stopPropagation();

		if (typeof FB === 'undefined') {
			return;
		}

		FB.ui({
			method: 'share',
			href: event.target.href
		}, (response) => {
			console.log(response);
		});
	}

	getMailShareLink(item) {
		var category = this.props.category;
		var categoryName = category ?
				category.name : this.utils.$Dictionary.get('home.defaultPortal');
		var query = {
			subject: this.utils.$Dictionary.get('home.shareMailSubject', {
				PORTAL: categoryName
			}),
			body: this.getPlainTextItemContent(item)
		};
		var queryString = Object.keys(query)
				.map((parameterName) => {
					var parts = [parameterName, query[parameterName]];
					return parts.map(encodeURIComponent).join('=');
				}).join('&');

		return `mailto:?${queryString}`;
	}

	getPlainTextItemContent(item) {
		if (item) {
			var content = item.getContent();
			return content.replace(/<[^>]*?>/g, '');
		}
		return '';
	}

	getPostLink(item, category) {
		if (item && category) {
			var localLink = this.utils.$Router.link('post', {
				category: category.getUrlName(),
				itemId: item.getId()
			});

			return localLink;
		} else {
			return router.link('home');
		}
	}

	onToggle(e) {
		e.preventDefault();
		e.stopPropagation();

		this.utils.$EventBus.fire(e.target, 'shareToggle', {
			item: this.props.item
		});
	}

	selectShareLink() {
		var input = this.refs.shareLink;

		if (input.setSelectionRange) {
			input.setSelectionRange(0, input.value.length);
		} else if (input.select) {
			input.select();
		}
	}
}

ns.App.Component.Share.View = View;
