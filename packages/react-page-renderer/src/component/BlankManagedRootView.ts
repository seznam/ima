import { ClassAttributes, Component, createElement } from 'react';

import ErrorBoundary from './ErrorBoundary';
import { ViewAdapterProps } from './ViewAdapter';

/**
 * Blank managed root view does not nothing except for rendering the current
 * page view.
 *
 * This is the default managed root view.
 */
export default class BlankManagedRootView extends Component<ViewAdapterProps> {
  static get defaultProps() {
    return {
      pageView: null,
    };
  }

  /**
   * @inheritDoc
   */
  render() {
    const { pageView, ...restProps } = this.props;

    if (!pageView) {
      return null;
    }

    const pageViewElement = createElement(
      pageView,
      restProps as ClassAttributes<ViewAdapterProps>
    );

    // Wrap view with ErrorBoundary in $Debug env
    return $Debug
      ? createElement(ErrorBoundary, null, pageViewElement)
      : pageViewElement;
  }
}
