import memoizeOne from 'memoize-one';
import { Component, ComponentClass, ComponentType, createElement } from 'react';

import PageContext from '../PageContext';
import { Utils } from '../types';

export interface ViewAdapterProps {
  $Utils: Utils;
  managedRootView: ComponentType;
  pageView?: ComponentType;
  refCallback?: () => void;
  state: State;
}

interface State {
  [key: string]: unknown;
}

/**
 * An adapter component providing the current page controller's state to the
 * page view component through its properties.
 */
export default class ViewAdapter extends Component<ViewAdapterProps, State> {
  private _getContextValue: (
    props: ViewAdapterProps,
    state: State
  ) => { $Utils: Utils };
  private _managedRootView: ComponentType;

  contextSelectors: Array<
    (props: ViewAdapterProps, state: State) => { [key: string]: unknown }
  > = [];
  createContext: (
    $Utils: Utils,
    values: { [key: string]: unknown }
  ) => { $Utils: Utils };

  /**
   * Initializes the adapter component.
   *
   * @param props Component properties, containing the actual page view
   *        and the initial page state to pass to the view.
   */
  constructor(props: ViewAdapterProps) {
    super(props);

    /**
     * The actual page view to render.
     */
    this._managedRootView = props.managedRootView;

    /**
     * The memoized context value.
     */
    this._getContextValue = memoizeOne((props, state) =>
      this.getContextValue(props, state)
    );

    /**
     * The function for creating context.
     */
    this.createContext = memoizeOne(
      ($Utils: Utils, values: { [key: string]: unknown }) => {
        return {
          $Utils,
          ...values,
        };
      }
    );
  }

  static getDerivedStateFromProps(
    props: ViewAdapterProps,
    state: ViewAdapterProps['state']
  ) {
    if (!state) {
      return props.state;
    }

    return {
      ...Object.keys(state).reduce<Record<string, unknown>>((acc, cur) => {
        acc[cur] = undefined;

        return acc;
      }, {}),
      ...props.state,
    };
  }

  getContextValue(props: ViewAdapterProps, state: State) {
    const selectedValues = this.contextSelectors.map(selector =>
      selector(props, state)
    );

    return this.createContext(
      props.$Utils,
      Object.assign.apply(null, [{}, ...selectedValues])
    );
  }

  /**
   * @inheritdoc
   */
  render() {
    return createElement(
      PageContext.Provider,
      { value: this._getContextValue(this.props, this.state) },
      createElement(
        this._managedRootView as ComponentClass,
        Object.assign({}, this.state, {
          pageView: this.props.pageView,
          ref: () => {
            if (this.props.refCallback) {
              this.props.refCallback();
            }
          },
        })
      )
    );
  }
}
