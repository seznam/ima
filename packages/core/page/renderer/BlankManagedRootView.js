import React, { PropTypes } from 'react';
import ns from '../../namespace';

ns.namespace('ima.page.renderer');

/**
 * @class BlankManagedRootView
 * @namespace ima.page.renderer
 * @module ima
 * @submodule ima.page
 */
export default class BlankManagedRootView extends React.Component {

	static get propTypes() {
		return {
			$pageView: PropTypes.func
		};
	}

	static get defaultProps() {
		return {
			$pageView: null
		}
	}

	/**
	 * @inheritdoc
	 * @override
	 * @method render
	 */
	render() {
		let pageView = this.props.$pageView;
		if (!pageView) {
			return null;
		}

		return React.createElement(pageView, this.props);
	}
}

ns.ima.page.renderer.BlankManagedRootView = BlankManagedRootView;
