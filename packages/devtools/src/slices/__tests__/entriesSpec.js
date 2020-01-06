import { entriesInitialState, reducer, actions, selectors } from '../entries';

describe('entriesInitialState', () => {
  it('should match snapshot', () => {
    expect(entriesInitialState).toMatchSnapshot();
  });
});

describe('reducer', () => {
  let curState;

  beforeEach(() => {
    curState = {
      entryIdsByQuery: ['0', '1'],
      entries: {
        0: {
          id: '0',
          selected: false,
          messages: [{ payload: { label: 'msg0' } }]
        },
        1: {
          id: '1',
          selected: true,
          messages: [{ payload: { label: 'msg1' } }]
        }
      },
      searchQuery: '',
      status: '',
      error: '',
      hasNext: true,
      hasPrevious: false,
      zeroTime: '0',
      selectedId: '0',
      isLoading: false
    };
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(entriesInitialState);
  });

  it('should add entries to state, reset loader and status, assign them new id, selected flag and update zero time for first item', () => {
    expect(
      reducer(entriesInitialState, {
        type: 'entries/addEntries',
        payload: [{ payload: { id: '0', label: 'msg2', time: 1100 } }]
      })
    ).toEqual({
      ...entriesInitialState,
      entryIdsByQuery: ['0'],
      entries: {
        0: {
          id: '0',
          selected: true,
          messages: [{ payload: { id: '0', label: 'msg2', time: 1100 } }]
        }
      },
      selectedId: '0',
      zeroId: '0',
      zeroTime: 1100,
      status: '',
      isLoading: false
    });
  });

  it('should reset some values on clearing entries', () => {
    expect(reducer(curState, { type: 'entries/clearEntries' })).toEqual({
      ...curState,
      entryIdsByQuery: [],
      entries: {},
      hasNext: false,
      hasPrevious: false,
      zeroTime: null,
      zeroId: null,
      selectedId: null
    });
  });

  it('should set status message on alive', () => {
    curState.isLoading = true;

    expect(reducer(curState, { type: 'entries/alive' })).toEqual({
      ...curState,
      status: 'Loading messages...'
    });
  });

  it('should set status message on dead and reset loader', () => {
    curState.isLoading = true;

    expect(reducer(curState, { type: 'entries/dead' })).toEqual({
      ...curState,
      status: 'This website does not use IMA.js',
      isLoading: false
    });
  });

  it('should set error message on unsupported and reset loader', () => {
    curState.isLoading = true;

    expect(reducer(curState, { type: 'entries/unsupported' })).toEqual({
      ...curState,
      error:
        'The devtools only support applications runnning IMA.js v17 or higher.',
      isLoading: false
    });
  });

  it('should set status message on reload and turn on loader', () => {
    expect(reducer(curState, { type: 'entries/reload' })).toEqual({
      ...curState,
      status: 'Reloading application...',
      isLoading: true
    });
  });

  it('should set search query and update entry ids by query', () => {
    expect(
      reducer(curState, {
        type: 'entries/setSearchQuery',
        payload: 'msg0'
      })
    ).toEqual({
      ...curState,
      entryIdsByQuery: ['0'],
      searchQuery: 'msg0',
      hasNext: false,
      hasPrevious: false
    });
  });

  it('should update selected entry and hasNext/hasPrevious flags', () => {
    expect(
      reducer(curState, { type: 'entries/setSelected', payload: '1' })
    ).toEqual({
      ...curState,
      entries: {
        0: {
          id: '0',
          selected: false,
          messages: [{ payload: { label: 'msg0' } }]
        },
        1: {
          id: '1',
          selected: true,
          messages: [{ payload: { label: 'msg1' } }]
        }
      },
      selectedId: '1',
      hasNext: false,
      hasPrevious: true
    });
  });

  it('should select next item in current filter and update hasNext/hasPrevious flags', () => {
    expect(reducer(curState, { type: 'entries/selectNext' })).toEqual({
      ...curState,
      entries: {
        0: {
          id: '0',
          selected: false,
          messages: [{ payload: { label: 'msg0' } }]
        },
        1: {
          id: '1',
          selected: true,
          messages: [{ payload: { label: 'msg1' } }]
        }
      },
      selectedId: '1',
      hasNext: false,
      hasPrevious: true
    });
  });

  it('should not do anything if there are no next items', () => {
    curState.entries[1].selected = true;
    curState.entries[0].selected = false;
    curState.selectedId = '1';
    curState.hasNext = false;
    curState.hasPrevious = true;

    expect(reducer(curState, { type: 'entries/selectNext' })).toEqual(curState);
  });

  it('should select previous item in current filter and update hasNext/hasPrevious flags', () => {
    curState.entries[1].selected = true;
    curState.entries[0].selected = false;
    curState.selectedId = '1';
    curState.hasNext = false;
    curState.hasPrevious = true;

    expect(reducer(curState, { type: 'entries/selectPrevious' })).toEqual({
      ...curState,
      entries: {
        0: {
          id: '0',
          selected: true,
          messages: [{ payload: { label: 'msg0' } }]
        },
        1: {
          id: '1',
          selected: false,
          messages: [{ payload: { label: 'msg1' } }]
        }
      },
      selectedId: '0',
      hasNext: true,
      hasPrevious: false
    });
  });

  it('should not do anything if there are no previous items', () => {
    expect(reducer(curState, { type: 'entries/selectPrevious' })).toEqual(
      curState
    );
  });
});

describe('actions', () => {
  it('should match snapshot', () => {
    expect(selectors).toMatchSnapshot();
  });

  it('should create action to add entries', () => {
    const entries = [{ payload: { label: 'msg' } }];

    expect(actions.addEntries(entries)).toEqual({
      payload: [{ payload: { label: 'msg' } }],
      type: 'entries/addEntries'
    });
  });

  it('should create action to clear entries', () => {
    expect(actions.clearEntries()).toEqual({
      type: 'entries/clearEntries'
    });
  });

  it('should create action to set state alive', () => {
    expect(actions.alive()).toEqual({
      type: 'entries/alive'
    });
  });

  it('should create action to set state dead', () => {
    expect(actions.dead()).toEqual({
      type: 'entries/dead'
    });
  });

  it('should create action to set state unsupported', () => {
    expect(actions.unsupported()).toEqual({
      type: 'entries/unsupported'
    });
  });

  it('should create action to set state reload', () => {
    expect(actions.reload()).toEqual({
      type: 'entries/reload'
    });
  });

  it('should create action to set search query', () => {
    expect(actions.setSearchQuery('query')).toEqual({
      type: 'entries/setSearchQuery',
      payload: 'query'
    });
  });

  it('should create action to set selected', () => {
    expect(actions.setSelected(123)).toEqual({
      type: 'entries/setSelected',
      payload: 123
    });
  });

  it('should create action to select next', () => {
    expect(actions.selectNext()).toEqual({
      type: 'entries/selectNext'
    });
  });

  it('should create action to select previous', () => {
    expect(actions.selectPrevious()).toEqual({
      type: 'entries/selectPrevious'
    });
  });
});

describe('selectors', () => {
  it('should match snapshot', () => {
    expect(selectors).toMatchSnapshot();
  });

  describe('getEntriesLength selector', () => {
    it('should return 0 for initial state', () => {
      const result = selectors.getEntriesLength.resultFunc(
        entriesInitialState.entries
      );

      expect(result).toBe(0);
    });

    it('should return entries length', () => {
      const result = selectors.getEntriesLength.resultFunc({
        0: 'entry0',
        1: 'entry0'
      });

      expect(result).toBe(2);
    });
  });
});
