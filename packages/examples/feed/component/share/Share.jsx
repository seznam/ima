import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';
import TweetButton from 'app/component/tweetButton/TweetButton';

/**
 * React component providing the UI for sharing feed items using social media
 * and e-mail.
 */
export default class Share extends AbstractComponent {

	render() {
		let label = this.localize('home.share');

		let item = this.props.item;
		let category = this.props.category;

		let active = this.props.active ? ' expanded' : '';
		let postLink = this.getPostLink(item, category);

		return (
			<div className={'share' + active}>
				<a href={postLink} className='toggle' onClick={(event) => this.onToggle(event)}>{label}</a>
				<div className='sharing-wrapper'>
					<div className='sharing-container'>
						<div className='arrow'/>
						<div className='arrow-overlay'/>
						<div className='sharing-options'>
							<input
									type='text'
									value={postLink}
									readOnly={true}
									ref='shareLink'
									onClick={(event)=>this.selectShareLink(event)}/>

							<a
									href={postLink}
									onClick={(event)=>this.onShareOnFacebook(event)}
									className='facebook'>
								<img
										src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/share/facebook.png'}
										alt='Facebook'/>
								Facebook
							</a>

							<TweetButton
									label='Twitter'
									url={postLink}
									text={this.getPlainTextItemContent(item)}
									hashTags={category.getHashTag()}/>

							<a href={this.getMailShareLink(item)} className='email'>
								<img
										src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/share/email.png'}
										alt='Email'/>
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
				category.name : this.localize('home.defaultPortal');
		let query = {
			subject: this.localize('home.shareMailSubject', {
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
			let localLink = this.link('post', {
				category: category.getUrlName(),
				itemId: item.getId()
			});

			return localLink;
		} else {
			return this.link('home');
		}
	}

	onToggle(event) {
		event.preventDefault();
		event.stopPropagation();

		this.fire('shareToggle', {
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
