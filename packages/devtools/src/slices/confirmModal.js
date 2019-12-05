import { createSlice } from 'redux-starter-kit';

export const confirmModalInitialState = {
  body: '',
  opened: false,
  accept: null,
  cancel: null
};

const confirmModal = createSlice({
  slice: 'confirmModal',
  initialState: confirmModalInitialState,
  reducers: {
    showConfirmModal(state, { payload: { body, accept, cancel } }) {
      state.opened = true;
      state.body = body || confirmModalInitialState.body;
      state.accept = accept || confirmModalInitialState.accept;
      state.cancel = cancel || confirmModalInitialState.cancel;
    },
    hideConfirmModal(state) {
      state.opened = false;
    }
  }
});

const { reducer, actions } = confirmModal;

export { reducer, actions };
