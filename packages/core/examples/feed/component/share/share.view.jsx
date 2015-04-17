import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent((utils) => {

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
	/* jshint ignore:start */
	ns.App.Component.Share.View = React.createClass({
		render() {
			var label = utils.dictionary.get('home.share');

			var TwitterButtonA = ns.App.Component.TweetButton.View;

			var item = this.props.item;
			var category = this.props.category;

			var active = this.props.active ? ' expanded' : '';
			var postLink = this.getPostLink(item, category);

			return (
				<div className={'share' + (active)}>
					<span className='toggle' onClick={this.onToggle}>{label}</span>
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
										onClick={this.selectShareLink}/>

								<a
										href={postLink}
										onClick={this.onShareOnFacebook}
										className='facebook'>Facebook
								</a>

								<TwitterButtonA
										label='Twitter'
										url={postLink}
										text={this.getPlainTextItemContent(item)}
										hashTags={category.getHashTag()}/>

								<a href={this.getMailShareLink(item)} className='email'>
									Email
								</a>
							</div>
						</div>
					</div>
				</div>
			);
		},

		onShareOnFacebook(event) {
			event.preventDefault();

			if (typeof FB === "undefined") {
				return;
			}

			FB.ui({
				method: 'share',
				href: event.target.href,
			}, (response) => {
				console.log(response);
			});
		},

		getMailShareLink(item) {
			var category = this.props.category;
			var categoryName = category ?
					category.name : utils.dictionary.get('home.defaultPortal');
			var query = {
				subject: utils.dictionary.get('home.shareMailSubject', {
					PORTAL: categoryName
				}),
				body: this.getPlainTextItemContent(item)
			};
			var queryString = Object.keys(query)
					.map((parameterName) => {
						var parts = [parameterName, query[parameterName]];
						return parts.map(encodeURIComponent).join("=");
					}).join("&");

			return `mailto:?${queryString}`;
		},

		getPlainTextItemContent(item) {
			if (item) {
				var content = item.getContent();
				return content.replace(/<[^>]*?>/g, '');
			}
			return '';
		},

		getPostLink(item, category) {
			if (item && category) {

				var localLink = utils.router.link('post', {
					category: category.getUrlName(),
					itemId: item.getId()
				});

				return localLink;
			} else {
				return router.link('home');
			}
			
		},

		onToggle() {
			utils.dispatcher.fire('shareToggle', {
				item: this.props.item
			});
		},

		selectShareLink() {
			var input = this.refs.shareLink.getDOMNode();
			
			if (input.setSelectionRange) {
				input.setSelectionRange(0, input.value.length);
			} else if (input.select) {
				input.select();
			}
		}
	});
	/* jshint ignore:end */
});
