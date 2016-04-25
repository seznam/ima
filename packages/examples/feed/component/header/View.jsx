import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.component.header');

/**
 * Header writing.
 *
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.component.header
 * @module app
 * @submodule app.component
 */
 class View extends AbstractComponent {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='l-header'>
				<a href={'//' + this.utils.$Dictionary.get('home.imaLink')} title={this.utils.$Dictionary.get('home.imaLink')}>
					{this.utils.$Dictionary.get('home.imaLink')}
				</a>
				<div className='title-wrapper'>
					<a href={this.utils.$Router.getBaseUrl()} title={this.utils.$Dictionary.get('home.pageTitle')} className="logo">
						<img src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/logo.png'} alt='Logo' />
					</a>
					<h1>{this.utils.$Dictionary.get('home.pageTitle')}</h1>
				</div>
			</div>
		);
	}
}

ns.app.component.header.View = View;
