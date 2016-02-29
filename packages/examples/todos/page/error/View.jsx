import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.page.error');

export default class View extends AbstractComponent {
	render() {
		let error = this.props.error || {};
		let message = error.message || '';
		let stack = error.stack || '';

		return (
			<div className='l-error'>
				<h1>500 &ndash; That's an error</h1>
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
