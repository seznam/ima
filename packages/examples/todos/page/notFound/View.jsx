import React from 'react';
import AbstractComponent from 'ima/page/AbstractComponent';

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
