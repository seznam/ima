import { Component, ComponentType, createElement } from 'react';
import memoizeOne from 'memoize-one';

import PageContext from './PageContext';

interface Props {
  state: State,
  view: ComponentType
}

interface State {
  [key: string]: any
}

/**
 * An adapter component providing the current page controller's state to the
 * page view component through its properties.
 */
export default class ViewAdapter extends Component<Props, State> {
  private _getContextValue: Function;
  private _view: ComponentType;

  contextSelectors: Array<Function>;
  createContext: Function;

  static getDerivedStateFromProps(props: Props, state: State): State {
    //we want use props.state only when props changed
    //temp indicator notUsePropsState is set by AbstractPageRenderer
    if (state.notUsePropsState) {
      return Object.assign({}, state, {
        $pageView: props.state.$pageView,
        notUsePropsState: undefined,
      });
    }

    return props.state;
  }

  /**
   * Initializes the adapter component.
   *
   * @param props Component properties, containing the actual page view
   *        and the initial page state to pass to the view.
   */
  constructor(props: Props) {
    super(props);

    /**
     * The current page state as provided by the controller.
     */
    this.state = props.state;

    /**
     * The actual page view to render.
     */
    this._view = props.view;

    /**
     * The memoized context value.
     */
    this._getContextValue = memoizeOne((props, state) =>
      this.getContextValue(props, state)
    );

    /**
     * The array of selectors for context values.
     */
    this.contextSelectors = [(props: any) => props.$Utils];

    /**
     * The function for creating context.
     */
    this.createContext = memoizeOne($Utils => {
      return { $Utils };
    });
  }

  getContextValue(props: Props, state: State) {
    const selectedValues = this.contextSelectors.map(selector =>
      selector(props, state)
    );

    return this.createContext(...selectedValues);
  }

  /**
   * @inheritdoc
   */
  render() {
    return createElement(
      PageContext.Provider,
      { value: this._getContextValue(this.props, this.state) },
      createElement(this._view, this.state)
    );
  }
}
