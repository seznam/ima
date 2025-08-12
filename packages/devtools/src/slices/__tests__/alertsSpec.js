import { beforeEach, describe, expect, it } from 'vitest';

import { alertsInitialState, alertsReducer, alertsActions } from '../alerts';

describe('alertsReducer', () => {
  let curState;

  beforeEach(() => {
    curState = {
      alerts: {
        0: {
          id: '0',
          hidden: false,
          title: 'title',
          content: 'content',
          type: 'type',
        },
      },
    };
  });

  it('should return the initial state', () => {
    expect(alertsReducer(undefined, {})).toStrictEqual(alertsInitialState);
  });

  it('should add alert to state', () => {
    expect(
      alertsReducer(curState, {
        type: 'alerts/showAlert',
        payload: {
          id: '1',
          title: 'title',
          content: 'content',
          type: 'type',
        },
      })
    ).toStrictEqual({
      ...curState,
      alerts: {
        ...curState.alerts,
        1: {
          id: '1',
          hidden: false,
          title: 'title',
          content: 'content',
          type: 'type',
        },
      },
    });
  });

  it('should remove alert from state', () => {
    expect(
      alertsReducer(curState, {
        type: 'alerts/removeAlert',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      alerts: {},
    });
  });

  it("should set alert's hidden property to true", () => {
    expect(
      alertsReducer(curState, {
        type: 'alerts/hideAlert',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      alerts: {
        0: {
          ...curState.alerts['0'],
          hidden: true,
        },
      },
    });
  });
});

describe('alertsActions', () => {
  it('should create action to show alert', () => {
    const data = {
      id: '0',
      title: 'title',
      content: 'content',
      type: 'type',
    };

    expect(alertsActions.showAlert(data)).toStrictEqual({
      type: 'alerts/showAlert',
      payload: {
        id: '0',
        title: 'title',
        content: 'content',
        type: 'type',
      },
    });
  });

  it('should create action to remove alert', () => {
    expect(alertsActions.removeAlert('0')).toStrictEqual({
      type: 'alerts/removeAlert',
      payload: '0',
    });
  });

  it('should create action to hide alert', () => {
    expect(alertsActions.hideAlert('0')).toStrictEqual({
      type: 'alerts/hideAlert',
      payload: '0',
    });
  });
});
