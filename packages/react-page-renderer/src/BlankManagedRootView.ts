import { Component, ComponentType, createElement } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface Props {
  $pageView: ComponentType;
}

/**
 * Blank managed root view does not nothing except for rendering the current
 * page view.
 *
 * This is the default managed root view.
 */
export default class BlankManagedRootView extends Component<Props> {
  static get defaultProps() {
    return {
      $pageView: null,
    };
  }

  /**
   * @inheritdoc
   */
  render() {
    const { $pageView, ...restProps } = this.props;

    if (!$pageView) {
      return null;
    }

    // Wrap view with ErrorBoundary in $Debug env
    return $Debug
      ? createElement(
          ErrorBoundary,
          null,
          createElement($pageView, restProps as any)
        )
      : createElement($pageView, restProps as any);
  }
}
