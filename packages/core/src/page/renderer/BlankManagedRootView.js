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
      $pageView: null,
    };
  }

  /**
   * @inheritdoc
   */
  render() {
    const { $pageView } = this.props;

    if (!$pageView) {
      return null;
    }

    const restProps = Object.assign({}, this.props);
    delete restProps.$pageView;

    return React.createElement($pageView, restProps);
  }
}
