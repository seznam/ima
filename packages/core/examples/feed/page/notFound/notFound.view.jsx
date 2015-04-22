import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent((utils) => {

	ns.namespace('App.Page.NotFound');

	/**
	 * Not Found Page view.
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
			return (
				<div className='l-not-found'>
					<h1>404 - Not Found</h1>
				</div>
			);
		}
	}

	ns.App.Page.NotFound.View = View;
});

