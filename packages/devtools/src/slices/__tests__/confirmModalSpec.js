import { beforeEach, describe, expect, it } from 'vitest';

import {
  confirmModalInitialState,
  confirmModalReducer,
  confirmModalActions,
} from '../confirmModal';

describe('confirmModalReducer', () => {
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
    expect(confirmModalReducer(undefined, {})).toStrictEqual(
      confirmModalInitialState
    );
  });

  it('should set opened to false', () => {
    expect(
      confirmModalReducer(curState, { type: 'confirmModal/hideConfirmModal' })
    ).toStrictEqual({
      ...curState,
      opened: false,
    });
  });

  it('should set opened to true and set data to state', () => {
    expect(
      confirmModalReducer(curState, {
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
      confirmModalReducer(curState, {
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

describe('confirmModalActions', () => {
  it('should create action to hide confirm modal', () => {
    expect(confirmModalActions.hideConfirmModal()).toStrictEqual({
      type: 'confirmModal/hideConfirmModal',
      payload: undefined,
    });
  });

  it('should create action to show confirm modal', () => {
    const data = {};

    expect(confirmModalActions.showConfirmModal(data)).toStrictEqual({
      type: 'confirmModal/showConfirmModal',
      payload: {},
    });
  });
});
