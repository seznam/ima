import { combineReducers } from '@reduxjs/toolkit';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { PanelContainer } from '@/components/template';
import { entriesReducer } from '@/slices';

const root = document.getElementById('root');

if (root) {
  const store = createStore(
    combineReducers({
      entries: entriesReducer,
    })
  );

  ReactDOM.render(
    <Provider store={store}>
      <PanelContainer />
    </Provider>,
    document.getElementById('root')
  );
}
