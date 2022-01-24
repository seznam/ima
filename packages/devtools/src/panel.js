import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers } from '@reduxjs/toolkit';
import { createStore } from 'redux';

import { reducer } from 'slices/entries';
import Panel from 'components/template/panel/PanelContainer';

const root = document.getElementById('root');

if (root) {
  const store = createStore(
    combineReducers({
      entries: reducer,
    })
  );

  ReactDOM.render(
    <Provider store={store}>
      <Panel />
    </Provider>,
    document.getElementById('root')
  );
}
