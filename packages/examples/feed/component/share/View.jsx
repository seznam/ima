import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.component.share');

/**
 * React component providing the UI for sharing feed items using social media
 * and e-mail.
 *
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.component.share
 * @module app
 * @submodule app.component
 */
class View extends AbstractComponent {

	constructor(props) {
		super(props);
	}

	render() {
		let label = this.utils.$Dictionary.get('home.share');

		let TwitterButton = ns.app.component.tweetButton.View;

		let item = this.props.item;
		let category = this.props.category;

		let active = this.props.active ? ' expanded' : '';
		let postLink = this.getPostLink(item, category);

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
		let category = this.props.category;
		let categoryName = category ?
				category.name : this.utils.$Dictionary.get('home.defaultPortal');
		let query = {
			subject: this.utils.$Dictionary.get('home.shareMailSubject', {
				PORTAL: categoryName
			}),
			body: this.getPlainTextItemContent(item)
		};
		let queryString = Object.keys(query)
				.map((parameterName) => {
					let parts = [parameterName, query[parameterName]];
					return parts.map(encodeURIComponent).join('=');
				}).join('&');

		return `mailto:?${queryString}`;
	}

	getPlainTextItemContent(item) {
		if (item) {
			let content = item.getContent();
			return content.replace(/<[^>]*?>/g, '');
		}
		return '';
	}

	getPostLink(item, category) {
		if (item && category) {
			let localLink = this.utils.$Router.link('post', {
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
		let input = this.refs.shareLink;

		if (input.setSelectionRange) {
			input.setSelectionRange(0, input.value.length);
		} else if (input.select) {
			input.select();
		}
	}
}

ns.app.component.share.View = View;
