import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.page.notFound');

export default class View extends AbstractComponent {
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
