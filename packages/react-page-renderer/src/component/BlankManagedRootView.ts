import { ClassAttributes, Component, createElement } from 'react';

import { ViewAdapterProps } from './ViewAdapter';

/**
 * Blank managed root view does not nothing except for rendering the current
 * page view.
 *
 * This is the default managed root view.
 */
export class BlankManagedRootView extends Component<ViewAdapterProps> {
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

    return createElement(
      pageView,
      restProps as ClassAttributes<ViewAdapterProps>
    );
  }
}
