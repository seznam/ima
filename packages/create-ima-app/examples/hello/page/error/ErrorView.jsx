import { PageContext, AbstractComponent } from '@ima/core';
import React from 'react';

/**
 * Error page.
 */
export default class ErrorView extends AbstractComponent {
  static get contextType() {
    return PageContext;
  }

  render() {
    let error = this.props.error || {};
    let message = error.message || '';
    let stack = error.stack || '';

    return (
      <div className="l-error">
        <h1>500 &ndash; Error</h1>
        <div className="message">{message}</div>
        <pre>{stack}</pre>
      </div>
    );
  }
}
