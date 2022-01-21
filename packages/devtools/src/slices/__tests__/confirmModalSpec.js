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
      cancel: null,
    };
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toStrictEqual(confirmModalInitialState);
  });

  it('should set opened to false', () => {
    expect(
      reducer(curState, { type: 'confirmModal/hideConfirmModal' })
    ).toStrictEqual({
      ...curState,
      opened: false,
    });
  });

  it('should set opened to true and set data to state', () => {
    expect(
      reducer(curState, {
        type: 'confirmModal/showConfirmModal',
        payload: {
          body: 'body',
          accept: 'accept',
          cancel: 'cancel',
        },
      })
    ).toStrictEqual({
      opened: true,
      body: 'body',
      accept: 'accept',
      cancel: 'cancel',
    });
  });

  it('should set opened to true and data to initial state if not provided', () => {
    expect(
      reducer(curState, {
        type: 'confirmModal/showConfirmModal',
        payload: {},
      })
    ).toStrictEqual({
      opened: true,
      body: confirmModalInitialState.body,
      accept: confirmModalInitialState.accept,
      cancel: confirmModalInitialState.cancel,
    });
  });
});

describe('actions', () => {
  it('should create action to hide confirm modal', () => {
    expect(actions.hideConfirmModal()).toStrictEqual({
      type: 'confirmModal/hideConfirmModal',
      payload: undefined,
    });
  });

  it('should create action to show confirm modal', () => {
    const data = {};

    expect(actions.showConfirmModal(data)).toStrictEqual({
      type: 'confirmModal/showConfirmModal',
      payload: {},
    });
  });
});
