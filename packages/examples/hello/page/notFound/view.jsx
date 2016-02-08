import ns from 'imajs/client/core/namespace';
import AbstractComponent from 'imajs/client/core/abstract/component';
import { React } from 'app/vendor';

ns.namespace('App.Page.NotFound');

/**
 * Master Layout.
 * @class View
 * @namespace App.Component.Layout.Master
 * @module App
 * @submodule Component
 */
export default class View extends AbstractComponent {

	render() {
		return (
			<div className='l-not-found'>
				<h1>404 - Not Found</h1>
			</div>
		);
	}
}

ns.App.Page.NotFound.View = View;
