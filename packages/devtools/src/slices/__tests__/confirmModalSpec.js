import { confirmModalInitialState, reducer, actions } from '../confirmModal';

describe('confirmModalInitialState', () => {
  it('should match snapshot', () => {
    expect(confirmModalInitialState).toMatchSnapshot();
  });
});

describe('reducer', () => {
  let curState;

  beforeEach(() => {
    curState = {
      body: '',
      opened: false,
      accept: null,
      cancel: null
    };
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(confirmModalInitialState);
  });

  it('should set opened to false', () => {
    expect(
      reducer(curState, { type: 'confirmModal/hideConfirmModal' })
    ).toEqual({
      ...curState,
      opened: false
    });
  });

  it('should set opened to true and set data to state', () => {
    expect(
      reducer(curState, {
        type: 'confirmModal/showConfirmModal',
        payload: {
          body: 'body',
          accept: 'accept',
          cancel: 'cancel'
        }
      })
    ).toEqual({
      opened: true,
      body: 'body',
      accept: 'accept',
      cancel: 'cancel'
    });
  });

  it('should set opened to true and data to initial state if not provided', () => {
    expect(
      reducer(curState, {
        type: 'confirmModal/showConfirmModal',
        payload: {}
      })
    ).toEqual({
      opened: true,
      body: confirmModalInitialState.body,
      accept: confirmModalInitialState.accept,
      cancel: confirmModalInitialState.cancel
    });
  });
});

describe('actions', () => {
  it('should create action to hide confirm modal', () => {
    expect(actions.hideConfirmModal()).toEqual({
      type: 'confirmModal/hideConfirmModal'
    });
  });

  it('should create action to show confirm modal', () => {
    const data = {};

    expect(actions.showConfirmModal(data)).toEqual({
      type: 'confirmModal/showConfirmModal',
      payload: {}
    });
  });
});
