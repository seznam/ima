import { PageContext, AbstractComponent } from '@ima/core';
import React from 'react';

export default class NotFoundView extends AbstractComponent {
  static get contextType() {
    return PageContext;
  }

  render() {
    return (
      <div className="l-not-found">
        <h1>404 &ndash; Not Found</h1>
      </div>
    );
  }
}
