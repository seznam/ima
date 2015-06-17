import ns from 'imajs/client/core/namespace.js';
import AbstractComponent from 'imajs/client/core/abstract/component.js';

ns.namespace('App.Page.Error');

/**
 * Master Layout.
 * @class View
 * @namespace App.Component.Layout.Master
 * @module App
 * @submodule Component
 */
class View extends AbstractComponent {

	constructor(props) {
		super(props);

		this.state = props;
	}

	render() {
		var error = this.state.error || {};
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
