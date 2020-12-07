import { alertsInitialState, reducer, actions } from '../alerts';

describe('alertsInitialState', () => {
  it('should match snapshot', () => {
    expect(alertsInitialState).toMatchSnapshot();
  });
});

describe('reducer', () => {
  let curState;

  beforeEach(() => {
    curState = {
      alerts: {
        0: {
          id: '0',
          hidden: false,
          title: 'title',
          content: 'content',
          type: 'type'
        }
      }
    };
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(alertsInitialState);
  });

  it('should add alert to state', () => {
    expect(
      reducer(curState, {
        type: 'alerts/showAlert',
        payload: {
          id: '1',
          title: 'title',
          content: 'content',
          type: 'type'
        }
      })
    ).toEqual({
      ...curState,
      alerts: {
        ...curState.alerts,
        1: {
          id: '1',
          hidden: false,
          title: 'title',
          content: 'content',
          type: 'type'
        }
      }
    });
  });

  it('should remove alert from state', () => {
    expect(
      reducer(curState, {
        type: 'alerts/removeAlert',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      alerts: {}
    });
  });

  it("should set alert's hidden property to true", () => {
    expect(
      reducer(curState, {
        type: 'alerts/hideAlert',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      alerts: {
        0: {
          ...curState.alerts['0'],
          hidden: true
        }
      }
    });
  });
});

describe('actions', () => {
  it('should create action to show alert', () => {
    const data = {
      id: '0',
      title: 'title',
      content: 'content',
      type: 'type'
    };

    expect(actions.showAlert(data)).toEqual({
      type: 'alerts/showAlert',
      payload: {
        id: '0',
        title: 'title',
        content: 'content',
        type: 'type'
      }
    });
  });

  it('should create action to remove alert', () => {
    expect(actions.removeAlert('0')).toEqual({
      type: 'alerts/removeAlert',
      payload: '0'
    });
  });

  it('should create action to hide alert', () => {
    expect(actions.hideAlert('0')).toEqual({
      type: 'alerts/hideAlert',
      payload: '0'
    });
  });
});
