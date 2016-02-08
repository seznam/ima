import ns from 'imajs/client/core/namespace';
import AbstractComponent from 'imajs/client/core/abstract/component';
import { React } from 'app/vendor';

ns.namespace('App.Page.Home');

/**
 * Master Layout.
 * @class View
 * @namespace App.Component.Layout.Master
 * @module App
 * @submodule Component
 */
export default class View extends AbstractComponent {

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

ns.App.Page.Home.View = View;
