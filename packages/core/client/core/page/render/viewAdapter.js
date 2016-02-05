import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('Core.Page.Render');

/**
 * An adapter component providing the current page controller's state to the
 * page view component through its properties.
 *
 * @class ViewAdapter
 * @namespace Core.Page.Render
 * @module Core
 * @submodule Core.Page
 */
export default class ViewAdapter extends React.Component {
	/**
	 * Initializes the adapter component.
	 *
	 * @constructor
	 * @method constructor
	 * @param {{state: Object<string, *>, view: function(new:Vendor.React.Component, Object<string, *>)}} props
	 *        Component properties, containing the actual page view and the
	 *        initial page state to pass to the view.
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
		 * @type {function(new:Vendor.React.Component, Object<string, *>)}
		 */
		this._view = props.view;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method render
	 */
	render() {
		return React.createElement(this._view, this.state);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getChildContext
	 */
	getChildContext() {
		return {
			$Utils: this.props.$Utils
		};
	}
}

ViewAdapter.childContextTypes = {
	$Utils: React.PropTypes.object.isRequired
};

ns.Core.Page.Render.ViewAdapter = ViewAdapter;
