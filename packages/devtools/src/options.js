import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { reducer as confirmModalReducer } from 'slices/confirmModal';
import { reducer as presetsReducer } from 'slices/presets';
import { reducer as alertsReducer } from 'slices/alerts';
import { Provider } from 'react-redux';

import Options from 'components/template/options/OptionsContainer';
import Alerts from 'components/molecule/alerts/AlertsContainer';
import ConfirmModal from 'components/molecule/confirmModal/ConfirmModalContainer';

const root = document.getElementById('root');

if (root) {
  const store = configureStore({
    reducer: {
      confirmModal: confirmModalReducer,
      presets: presetsReducer,
      alerts: alertsReducer
    },
    devTools: false,
    middleware: getDefaultMiddleware({
      thunk: true,
      immutableCheck: false,
      serializableCheck: false
    })
  });

  ReactDOM.render(
    <Provider store={store}>
      <ConfirmModal />
      <Alerts />
      <Options />
    </Provider>,
    document.getElementById('root')
  );
}
