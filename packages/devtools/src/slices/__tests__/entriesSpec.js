import { beforeEach, describe, expect, it } from 'vitest';

import {
  entriesInitialState,
  entriesReducer,
  entriesActions,
  entriesSelectors,
} from '../entries';

describe('entriesReducer', () => {
  let curState;

  beforeEach(() => {
    curState = {
      entryIdsByQuery: ['0', '1'],
      entries: {
        0: {
          id: '0',
          selected: false,
          messages: [{ payload: { label: 'msg0' } }],
        },
        1: {
          id: '1',
          selected: true,
          messages: [{ payload: { label: 'msg1' } }],
        },
      },
      searchQuery: '',
      status: '',
      error: '',
      hasNext: true,
      hasPrevious: false,
      zeroTime: '0',
      selectedId: '0',
      isLoading: false,
    };
  });

  it('should return the initial state', () => {
    expect(entriesReducer(undefined, {})).toStrictEqual(entriesInitialState);
  });

  it('should add entries to state, reset loader and status, assign them new id, selected flag and update zero time for first item', () => {
    expect(
      entriesReducer(entriesInitialState, {
        type: 'entries/addEntries',
        payload: [{ payload: { id: '0', label: 'msg2', time: 1100 } }],
      })
    ).toStrictEqual({
      ...entriesInitialState,
      entryIdsByQuery: ['0'],
      entries: {
        0: {
          id: '0',
          selected: true,
          messages: [{ payload: { id: '0', label: 'msg2', time: 1100 } }],
        },
      },
      selectedId: '0',
      zeroId: '0',
      zeroTime: 1100,
      status: '',
      isLoading: false,
    });
  });

  it('should reset some values on clearing entries', () => {
    expect(
      entriesReducer(curState, { type: 'entries/clearEntries' })
    ).toStrictEqual({
      ...curState,
      entryIdsByQuery: [],
      entries: {},
      hasNext: false,
      hasPrevious: false,
      zeroTime: null,
      zeroId: null,
      selectedId: null,
    });
  });

  it('should set status message on alive', () => {
    curState.isLoading = true;

    expect(entriesReducer(curState, { type: 'entries/alive' })).toStrictEqual({
      ...curState,
      status: 'Loading messages...',
    });
  });

  it('should set status message on dead and reset loader', () => {
    curState.isLoading = true;

    expect(entriesReducer(curState, { type: 'entries/dead' })).toStrictEqual({
      ...curState,
      status: 'This website does not use IMA.js',
      isLoading: false,
    });
  });

  it('should set error message on unsupported and reset loader', () => {
    curState.isLoading = true;

    expect(
      entriesReducer(curState, { type: 'entries/unsupported' })
    ).toStrictEqual({
      ...curState,
      error:
        'The devtools only support applications runnning IMA.js v17 or higher.',
      isLoading: false,
    });
  });

  it('should set status message on reload and turn on loader', () => {
    expect(entriesReducer(curState, { type: 'entries/reload' })).toStrictEqual({
      ...curState,
      status: 'Reloading application...',
      isLoading: true,
    });
  });

  it('should set search query and update entry ids by query', () => {
    expect(
      entriesReducer(curState, {
        type: 'entries/setSearchQuery',
        payload: 'msg0',
      })
    ).toStrictEqual({
      ...curState,
      entryIdsByQuery: ['0'],
      searchQuery: 'msg0',
      hasNext: false,
      hasPrevious: false,
    });
  });

  it('should update selected entry and hasNext/hasPrevious flags', () => {
    expect(
      entriesReducer(curState, { type: 'entries/setSelected', payload: '1' })
    ).toStrictEqual({
      ...curState,
      entries: {
        0: {
          id: '0',
          selected: false,
          messages: [{ payload: { label: 'msg0' } }],
        },
        1: {
          id: '1',
          selected: true,
          messages: [{ payload: { label: 'msg1' } }],
        },
      },
      selectedId: '1',
      hasNext: false,
      hasPrevious: true,
    });
  });

  it('should select next item in current filter and update hasNext/hasPrevious flags', () => {
    expect(
      entriesReducer(curState, { type: 'entries/selectNext' })
    ).toStrictEqual({
      ...curState,
      entries: {
        0: {
          id: '0',
          selected: false,
          messages: [{ payload: { label: 'msg0' } }],
        },
        1: {
          id: '1',
          selected: true,
          messages: [{ payload: { label: 'msg1' } }],
        },
      },
      selectedId: '1',
      hasNext: false,
      hasPrevious: true,
    });
  });

  it('should not do anything if there are no next items', () => {
    curState.entries[1].selected = true;
    curState.entries[0].selected = false;
    curState.selectedId = '1';
    curState.hasNext = false;
    curState.hasPrevious = true;

    expect(
      entriesReducer(curState, { type: 'entries/selectNext' })
    ).toStrictEqual(curState);
  });

  it('should select previous item in current filter and update hasNext/hasPrevious flags', () => {
    curState.entries[1].selected = true;
    curState.entries[0].selected = false;
    curState.selectedId = '1';
    curState.hasNext = false;
    curState.hasPrevious = true;

    expect(
      entriesReducer(curState, { type: 'entries/selectPrevious' })
    ).toStrictEqual({
      ...curState,
      entries: {
        0: {
          id: '0',
          selected: true,
          messages: [{ payload: { label: 'msg0' } }],
        },
        1: {
          id: '1',
          selected: false,
          messages: [{ payload: { label: 'msg1' } }],
        },
      },
      selectedId: '0',
      hasNext: true,
      hasPrevious: false,
    });
  });

  it('should not do anything if there are no previous items', () => {
    expect(
      entriesReducer(curState, { type: 'entries/selectPrevious' })
    ).toStrictEqual(curState);
  });
});

describe('entriesActions', () => {
  it('should create action to add entries', () => {
    const entries = [{ payload: { label: 'msg' } }];

    expect(entriesActions.addEntries(entries)).toStrictEqual({
      payload: [{ payload: { label: 'msg' } }],
      type: 'entries/addEntries',
    });
  });

  it('should create action to clear entries', () => {
    expect(entriesActions.clearEntries()).toStrictEqual({
      type: 'entries/clearEntries',
      payload: undefined,
    });
  });

  it('should create action to set state alive', () => {
    expect(entriesActions.alive()).toStrictEqual({
      type: 'entries/alive',
      payload: undefined,
    });
  });

  it('should create action to set state dead', () => {
    expect(entriesActions.dead()).toStrictEqual({
      type: 'entries/dead',
      payload: undefined,
    });
  });

  it('should create action to set state unsupported', () => {
    expect(entriesActions.unsupported()).toStrictEqual({
      type: 'entries/unsupported',
      payload: undefined,
    });
  });

  it('should create action to set state reload', () => {
    expect(entriesActions.reload()).toStrictEqual({
      type: 'entries/reload',
      payload: undefined,
    });
  });

  it('should create action to set search query', () => {
    expect(entriesActions.setSearchQuery('query')).toStrictEqual({
      type: 'entries/setSearchQuery',
      payload: 'query',
    });
  });

  it('should create action to set selected', () => {
    expect(entriesActions.setSelected(123)).toStrictEqual({
      type: 'entries/setSelected',
      payload: 123,
    });
  });

  it('should create action to select next', () => {
    expect(entriesActions.selectNext()).toStrictEqual({
      type: 'entries/selectNext',
      payload: undefined,
    });
  });

  it('should create action to select previous', () => {
    expect(entriesActions.selectPrevious()).toStrictEqual({
      type: 'entries/selectPrevious',
      payload: undefined,
    });
  });
});

describe('entriesSelectors', () => {
  describe('getEntriesLength selector', () => {
    it('should return 0 for initial state', () => {
      const result = entriesSelectors.getEntriesLength.resultFunc(
        entriesInitialState.entries
      );

      expect(result).toBe(0);
    });

    it('should return entries length', () => {
      const result = entriesSelectors.getEntriesLength.resultFunc({
        0: 'entry0',
        1: 'entry0',
      });

      expect(result).toBe(2);
    });
  });
});
