import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent((utils) => {

	ns.namespace('App.Page.Error');

	/**
	 * Error Page view.
	 *
	 * @class View
	 * @extends React.Component
	 * @namespace App.Page.Error
	 * @module App
	 * @submodule App.Page
	 */
	class View extends React.Component {

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
});

