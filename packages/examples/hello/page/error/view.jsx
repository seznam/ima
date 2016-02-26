import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import { React } from 'react';

ns.namespace('App.Page.Error');

/**
 * Master Layout.
 * @class View
 * @namespace App.Component.Layout.Master
 * @module App
 * @submodule Component
 */
export default class View extends AbstractComponent {

	render() {
		var error = this.props.error || {};
		var message = error.message || '';
		var stack = error.stack || '';

		return (
			<div className='l-error'>
				<h1>500 - Error</h1>
				<div className="message">
					{message}
				</div>
				<pre>
					{stack}
				</pre>
			</div>
		);
	}
}

ns.App.Page.Error.View = View;
