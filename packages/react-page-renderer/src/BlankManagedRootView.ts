import {
  ClassAttributes,
  Component,
  ComponentType,
  createElement,
} from 'react';

import ErrorBoundary from './ErrorBoundary';
import { Utils } from './types';

export interface BlankManagedRootViewProps {
  $pageView?: ComponentType;
  $Utils: Utils;
  state: { [key: string]: unknown };
  view: ComponentType;
}

/**
 * Blank managed root view does not nothing except for rendering the current
 * page view.
 *
 * This is the default managed root view.
 */
export default class BlankManagedRootView extends Component<BlankManagedRootViewProps> {
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

    const pageViewElement = createElement(
      $pageView,
      restProps as ClassAttributes<BlankManagedRootViewProps>
    );

    // Wrap view with ErrorBoundary in $Debug env
    return $Debug
      ? createElement(ErrorBoundary, null, pageViewElement)
      : pageViewElement;
  }
}
