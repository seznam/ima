import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent((utils) => {

	ns.namespace('App.Component.Header');

	/**
	 * Header writing.
	 *
	 * @class View
	 * @namespace App.Component.Header
	 * @module App
	 * @submodule Component
	 */
	 class View extends React.Component {

		constructor(props) {
			super(props);
		}
		
		render() {

			return (
				<div className='l-header'>
					<a href={'//'+utils.dictionary.get('home.imaLink')} title={utils.dictionary.get('home.imaLink')}>{utils.dictionary.get('home.imaLink')}</a>
					<div className='title-wrapper'>
						<a href='/' title={utils.dictionary.get('home.pageTitle')} className="logo"></a>
						<h1>{utils.dictionary.get('home.pageTitle')}</h1>
					</div>
				</div>
			);
		}
	}
	
	ns.App.Component.Header.View = View;
});
