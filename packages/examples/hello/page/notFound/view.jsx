import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import { React } from 'react';

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
