import AbstractComponent from 'ima/page/AbstractComponent';
import React, { PropTypes } from 'react';

/**
 * @class NotFoundView
 * @extends ima.page.AbstractComponent
 * @namespace app.page.notFound
 * @module app
 * @submodule app.component
 */
class NotFoundView extends AbstractComponent {

	static get contextTypes() {
		return {
			$Utils: PropTypes.object
		};
	}

	render() {
		return (
			<div className='l-not-found'>
				<h1>404 &ndash; Not Found</h1>
			</div>
		);
	}
}
