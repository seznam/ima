import ns from 'ima/namespace';
import React from 'react';
import AbstractComponent from 'ima/page/AbstractComponent';

ns.namespace('app.page.error');

/**
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.page.error
 * @module App
 * @submodule app.page
 */
class View extends AbstractComponent {

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

ns.app.page.error.View = View;
