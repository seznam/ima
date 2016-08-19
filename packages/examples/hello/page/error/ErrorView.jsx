import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.page.error');

/**
 * Error page.
 * @class ErrorView
 * @extends ima.page.AbstractComponent
 * @namespace app.page.error
 * @module app
 * @submodule app.page
 */
export default class ErrorView extends AbstractComponent {

	render() {
		let error = this.props.error || {};
		let message = error.message || '';
		let stack = error.stack || '';

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

ErrorView.contextTypes = {
	$Utils: React.PropTypes.object
};

ns.app.page.error.ErrorView = ErrorView;
