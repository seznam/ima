import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.page.home');

/**
 * Home page.
 * @class HomeView
 * @extends ima.page.AbstractComponent
 * @namespace app.page.home
 * @module app
 * @submodule app.page
 */
export default class HomeView extends AbstractComponent {

	render() {
		return (
			<div className='l-homepage'>
				<div className='content'>
					<img src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.image + '/imajs-logo.png'} alt='IMA.js logo'/>
					<h1>
						{this.utils.$Dictionary.get('home.hello')}, {this.props.message} <a href='//imajs.io' title={this.props.name} target='_blank'>{this.props.name}</a>!
					</h1>
				</div>
			</div>
		);
	}
}

ns.app.page.home.HomeView = HomeView;
