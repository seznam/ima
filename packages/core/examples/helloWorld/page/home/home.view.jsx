import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent((utils) => {

	ns.namespace('App.Page.Home');

	/**
	 * Master Layout.
	 * @class View
	 * @namespace App.Component.Layout.Master
	 * @module App
	 * @submodule Component
	 */
	class View extends React.Component {

		constructor(props) {
			super(props);

			this.state = props;
		}

		render() {
			return (
				<div className='l-homepage'>
					<div className='content'>
						<img src="static/img/imajs-logo.png" alt="IMA.js logo"/>
						<h1>{utils.dictionary.get('home.hello')}, {this.state.message}</h1>
					</div>
				</div>
			);
		}
	}

	ns.App.Page.Home.View = View;
});

