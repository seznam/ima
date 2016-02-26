import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.page.notFound');

/**
 * Not found page.
 *
 * @class NotFoundView
 * @extends ima.page.AbstractComponent
 * @namespace app.page.notFound
 * @module app
 * @submodule app.page
 */
export default class NotFoundView extends AbstractComponent {

	render() {
		return (
			<div className='l-not-found'>
				<h1>404 - Not Found</h1>
			</div>
		);
	}
}

ns.app.page.notFound.NotFoundView = NotFoundView;
