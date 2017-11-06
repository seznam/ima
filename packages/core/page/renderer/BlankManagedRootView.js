import PropTypes from 'prop-types';
import React from 'react';
import ns from '../../namespace';

ns.namespace('ima.page.renderer');

/**
 * Blank managed root view does not nothing except for rendering the current
 * page view.
 *
 * This is the default managed root view.
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
		};
	}

	/**
	 * @inheritdoc
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
