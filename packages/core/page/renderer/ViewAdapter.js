import React from 'react';
import ns from '../../namespace';

ns.namespace('ima.page.renderer');

/**
 * An adapter component providing the current page controller's state to the
 * page view component through its properties.
 *
 * @class ViewAdapter
 * @namespace ima.page.renderer
 * @module ima
 * @submodule ima.page
 */
export default class ViewAdapter extends React.Component {
	/**
	 * @inheritdoc
	 * @override
	 * @property childContextTypes
	 * @return {{$Utils: function(*): ?Error}}
	 */
	static get childContextTypes() {
		return {
			$Utils: React.PropTypes.object.isRequired
		};
	}

	/**
	 * Initializes the adapter component.
	 *
	 * @constructor
	 * @method constructor
	 * @param {{
	 *          state: Object<string, *>,
	 *          view: function(new:React.Component, Object<string, *>)
	 *        }} props Component properties, containing the actual page view
	 *        and the initial page state to pass to the view.
	 */
	constructor(props) {
		super(props.props);

		/**
		 * The current page state as provided by the controller.
		 *
		 * @property state
		 * @type {Object<string, *>}
		 */
		this.state = props.state;

		/**
		 * The actual page view to render.
		 *
		 * @private
		 * @property _view
		 * @type {function(new:React.Component, Object<string, *>)}
		 */
		this._view = props.view;
	}

	/**
	 * @inheritdoc
	 * @override
	 * @method render
	 */
	render() {
		return React.createElement(this._view, this.state);
	}

	/**
	 * @inheritdoc
	 * @method getChildContext
	 */
	getChildContext() {
		return {
			$Utils: this.props.$Utils
		};
	}
}

ns.ima.page.renderer.ViewAdapter = ViewAdapter;
