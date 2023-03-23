import {
  ClassAttributes,
  Component,
  ComponentType,
  createElement,
} from 'react';

export interface BlankManagedRootViewProps {
  pageView?: ComponentType;
}

/**
 * Blank managed root view does not nothing except for rendering the current
 * page view.
 *
 * This is the default managed root view.
 */
export class BlankManagedRootView<
  P extends BlankManagedRootViewProps = BlankManagedRootViewProps,
  S = unknown,
  SS = unknown
> extends Component<P, S, SS> {
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
      restProps as ClassAttributes<Omit<BlankManagedRootViewProps, 'pageView'>>
    );
  }
}
