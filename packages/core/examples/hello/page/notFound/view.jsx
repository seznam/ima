import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Page.NotFound');

/**
 * Master Layout.
 * @class View
 * @namespace App.Component.Layout.Master
 * @module App
 * @submodule Component
 */
class View extends ns.Core.Abstract.Component {

	render() {
		return (
			<div className='l-not-found'>
				<h1>404 - Not Found</h1>
			</div>
		);
	}
}

ns.App.Page.NotFound.View = View;
