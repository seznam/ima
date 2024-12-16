import type { Utils } from '@ima/core';
import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { Component, ComponentClass, ComponentType, createElement } from 'react';

import { ErrorBoundary } from './ErrorBoundary';
import { PageContext, PageContextType } from '../PageContext';

export interface ViewAdapterProps {
  $Utils: Utils;
  managedRootView: ComponentType;
  pageView?: ComponentType;
  refCallback?: () => void;
  state: State;
}

interface State {
  [key: string]: any;
}

/**
 * An adapter component providing the current page controller's state to the
 * page view component through its properties.
 */
export class ViewAdapter extends Component<ViewAdapterProps, State> {
  private _managedRootView: ComponentType;
  private _getContextValue: (
    props: ViewAdapterProps,
    state: State
  ) => PageContextType;

  createContext: MemoizedFn<(...args: any[]) => PageContextType>;
  contextSelectors: Array<(props: ViewAdapterProps, state: State) => any> = [
    props => props.$Utils,
  ];

  /**
   * Initializes the adapter component.
   *
   * @param props Component properties, containing the actual page view
   *        and the initial page state to pass to the view.
   */
  constructor(props: ViewAdapterProps) {
    super(props);

    this.state = {};

    /**
     * The actual page view to render.
     */
    this._managedRootView = props.managedRootView;

    /**
     * The memoized context value.
     */
    this._getContextValue = memoizeOne(
      (props: ViewAdapterProps, state: State) =>
        this.getContextValue(props, state)
    );

    /**
     * The function for creating context.
     */
    this.createContext = memoizeOne(($Utils: Utils, ...values: any[]) => {
      return {
        $Utils,
        ...values,
      };
    });
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
    return this.createContext(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
      ...this.contextSelectors.map(selector => selector(props, state))
    );
  }

  /**
   * @inheritDoc
   */
  render() {
    const viewElement = createElement(
      PageContext.Provider,
      { value: this._getContextValue(this.props, this.state) },
      createElement(
        this._managedRootView as ComponentClass,
        Object.assign({}, this.state, {
          pageView: this.props.pageView,
          ref: (element: any) => {
            if (element && this.props.refCallback) {
              this.props.refCallback();
            }
          },
        })
      )
    );

    // Wrap view with ErrorBoundary in $Debug env
    return $Debug
      ? createElement(ErrorBoundary, null, viewElement)
      : viewElement;
  }
}
