import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

/**
 * Feed header.
 *
 * @class Header
 * @extends ima.page.AbstractComponent
 * @namespace app.component.header
 * @module app
 * @submodule app.component
 */
export default class Header extends AbstractComponent {

	render() {
		return (
			<div className='l-header'>
				<a href={'//' + this.localize('home.imaLink')} title={this.localize('home.imaLink')}>
					{this.localize('home.imaLink')}
				</a>
				<div className='title-wrapper'>
					<a href={this.link('home')} title={this.localize('home.pageTitle')} className='logo'>
						<img src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/logo.png'} alt='Logo'/>
					</a>
					<h1>{this.localize('home.pageTitle')}</h1>
				</div>
			</div>
		);
	}
}
