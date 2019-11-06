import React from 'react';

/**
 * Blank managed root view does not nothing except for rendering the current
 * page view.
 *
 * This is the default managed root view.
 */
export default class BlankManagedRootView extends React.Component {
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
