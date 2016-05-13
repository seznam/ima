import ns from 'ima/namespace';
import React from 'react';
import AbstractComponent from 'ima/page/AbstractComponent';

ns.namespace('app.page.notFound');

/**
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.page.notFound
 * @module app
 * @submodule app.component
 */
class View extends AbstractComponent {

	render() {
		return (
			<div className='l-not-found'>
				<h1>404 - Not Found</h1>
			</div>
		);
	}
}

View.contextTypes = {
	$Utils: React.PropTypes.object
};

ns.app.page.notFound.View = View;
