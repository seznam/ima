import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Page.Error');

/**
 * Master Layout.
 * @class View
 * @namespace App.Component.Layout.Master
 * @module App
 * @submodule Component
 */
class View extends ns.Core.Abstract.Component {

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
