import { createSlice } from '@reduxjs/toolkit';
import uid from 'easy-uid';

export const alertsInitialState = {
  alerts: {}
};

const alerts = createSlice({
  name: 'alerts',
  initialState: alertsInitialState,
  reducers: {
    showAlert(state, { payload }) {
      const { id, title, content, type } = payload;

      state.alerts[id] = {
        id,
        hidden: false,
        title,
        content,
        type
      };
    },
    removeAlert(state, { payload: id }) {
      delete state.alerts[id];
    },
    hideAlert(state, { payload: id }) {
      if (state.alerts[id]) {
        state.alerts[id].hidden = true;
      }
    }
  }
});

alerts.actions.showAlertWithTimeout = (alert, timeout) => async dispatch => {
  const id = uid();
  alert.id = id;

  // Show alert
  dispatch(alerts.actions.showAlert(alert));

  // Hide alert after certain time
  setTimeout(() => {
    dispatch(alerts.actions.hideAlert(id));

    setTimeout(() => {
      dispatch(alerts.actions.removeAlert(id));
    }, 200);
  }, timeout - 200);
};

alerts.actions.success = (text, timeout = 3000) => {
  return alerts.actions.showAlertWithTimeout(
    {
      content: text,
      type: 'success'
    },
    timeout
  );
};

alerts.actions.danger = (text, timeout = 3000) => {
  return alerts.actions.showAlertWithTimeout(
    {
      content: text,
      type: 'danger'
    },
    timeout
  );
};

alerts.actions.default = (text, timeout = 3000) => {
  return alerts.actions.showAlertWithTimeout(
    {
      content: text,
      type: 'default'
    },
    timeout
  );
};

const { reducer, actions } = alerts;

export { reducer, actions };
