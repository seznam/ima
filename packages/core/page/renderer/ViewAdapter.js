import React from 'react';
import memoizeOne from 'memoize-one';
import Context from '../Context';

/**
 * An adapter component providing the current page controller's state to the
 * page view component through its properties.
 */
export default class ViewAdapter extends React.Component {
  /**
   * Initializes the adapter component.
   *
   * @param {{
   *          state: Object<string, *>,
   *          view: function(new:React.Component, Object<string, *>)
   *        }} props Component properties, containing the actual page view
   *        and the initial page state to pass to the view.
   */
  constructor(props) {
    super(props.props);

    /**
     * The current page state as provided by the controller.
     *
     * @type {Object<string, *>}
     */
    this.state = props.state;

    /**
     * The actual page view to render.
     *
     * @type {function(new:React.Component, Object<string, *>)}
     */
    this._view = props.view;

    /**
     * The memoized context value.
     *
     * @type {function}
     */
    this._getContextValue = memoizeOne($Utils => {
      return { $Utils };
    });
  }

  /**
   * Fixes an issue where when there's an error in React component,
   * the defined ErrorPage may not get re-rendered and white
   * blank page appears instead.
   *
   * @inheritdoc
   */
  componentDidCatch() {}

  /**
   * @inheritdoc
   */
  render() {
    return React.createElement(
      Context.Provider,
      { value: this._getContextValue(this.props.$Utils) },
      React.createElement(this._view, this.state)
    );
  }
}
