import ns from 'imajs/client/core/namespace.js';
import AbstractComponent from 'imajs/client/core/abstract/viewComponent.js';

ns.namespace('App.Page.NotFound');

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
		return (
			<div className='l-not-found'>
				<h1>404 - Not Found</h1>
			</div>
		);
	}
}

ns.App.Page.NotFound.View = View;
