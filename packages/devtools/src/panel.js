import { combineReducers } from '@reduxjs/toolkit';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Panel from '@/components/template/panel/PanelContainer';
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
      <Panel />
    </Provider>,
    document.getElementById('root')
  );
}
