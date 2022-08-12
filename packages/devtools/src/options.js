import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { AlertsContainer, ConfirmModalContainer } from '@/components/molecule';
import { OptionsContainer } from '@/components/template';
import { alertsReducer, confirmModalReducer, presetsReducer } from '@/slices';

const root = document.getElementById('root');

if (root) {
  const store = configureStore({
    reducer: {
      confirmModal: confirmModalReducer,
      presets: presetsReducer,
      alerts: alertsReducer,
    },
    devTools: false,
    middleware: getDefaultMiddleware({
      thunk: true,
      immutableCheck: false,
      serializableCheck: false,
    }),
  });

  ReactDOM.render(
    <Provider store={store}>
      <ConfirmModalContainer />
      <AlertsContainer />
      <OptionsContainer />
    </Provider>,
    document.getElementById('root')
  );
}
