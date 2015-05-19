import ns from 'imajs/client/core/namespace.js';
import component from 'imajs/client/core/component.js';

component.add((utils) => {

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
					<div className='content' toggle={this.state.toggle}>
						<img src="static/img/imajs-logo.png" alt="IMA.js logo"/>
						<h1>{utils.$Dictionary.get('home.hello')}, {this.state.message}</h1>
					</div>
				</div>
			);
		}
	}

	ns.App.Page.Home.View = View;
});

