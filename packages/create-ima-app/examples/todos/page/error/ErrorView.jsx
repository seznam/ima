import { PageContext, AbstractComponent } from '@ima/core';
import React from 'react';

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
        <h1>500 &ndash; That is an error</h1>
        <div className="message">{message}</div>
        <pre>{stack}</pre>
      </div>
    );
  }
}
