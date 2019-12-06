import { createSelector, createSlice } from '@reduxjs/toolkit';

export const entriesInitialState = {
  entryIdsByQuery: [],
  entries: {},
  searchQuery: '',
  status: 'Connecting...',
  hasNext: false,
  hasPrevious: false,
  zeroTime: null,
  zeroId: null,
  selectedId: null,
  isLoading: true
};

const updateHasPreviousNext = state => {
  state.hasNext =
    state.entryIdsByQuery.indexOf(state.selectedId) <
    state.entryIdsByQuery.length - 1;
  state.hasPrevious = state.entryIdsByQuery.indexOf(state.selectedId) > 0;
};

const updateSelected = (state, newId) => {
  // Reset selected ID
  if (newId === null && state.selectedId !== null) {
    state.entries[state.selectedId].selected = false;
    state.selectedId = null;
  } else {
    // Update selectedId and entry items selected flag
    if (state.selectedId !== null && state.selectedId !== newId) {
      state.entries[state.selectedId].selected = false;
    }

    state.entries[newId].selected = true;
    state.selectedId = newId;
  }
};

const updateEntryIdsByQuery = state => {
  if (state.searchQuery) {
    // Build regexp from search query
    const parts = state.searchQuery.split('/');
    const re = parts[1]
      ? new RegExp(parts[1], parts[2])
      : new RegExp(parts[0], 'i');

    let selectedEntryInQuery = false;
    state.entryIdsByQuery = [];

    for (let id in state.entries) {
      const entryLabel =
        state.entries[id].messages[
          Math.max(state.entries[id].messages.length - 1, 0)
        ].payload.label;

      if (re.test(entryLabel)) {
        state.entryIdsByQuery.push(id);

        // Check if selected entry is in the filtered list
        if (!selectedEntryInQuery) {
          selectedEntryInQuery = id === state.selectedId;
        }
      }
    }

    // If selected entry is not in current filter, we select first item in filtered query
    if (!selectedEntryInQuery && state.entryIdsByQuery.length > 0) {
      updateSelected(state, state.entryIdsByQuery[0]);
    } else if (state.entryIdsByQuery.length <= 0) {
      updateSelected(state, null);
    }
  } else {
    state.entryIdsByQuery = Object.keys(state.entries);

    // Set first item as selected if selectedId is null
    if (!state.selectedId) {
      state.selectedId = state.entries[state.entryIdsByQuery[0]].id;
    }
  }

  // Update hasNext/hasPrevious flags
  updateHasPreviousNext(state);
};

const entries = createSlice({
  name: 'entries',
  initialState: entriesInitialState,
  reducers: {
    addEntries(state, action) {
      const { payload: entries } = action;
      let isFirst =
        state.zeroTime === null &&
        state.zeroId === null &&
        state.selectedId === null;

      entries.forEach(msg => {
        const { time, id } = msg.payload;

        if (isFirst) {
          state.zeroTime = time;
          state.zeroId = id;
          state.selectedId = id;
          state.status = '';
          state.isLoading = false;
        }

        // Update existing entries
        if (state.entries[id]) {
          state.entries[id].messages.push(msg);
        } else {
          state.entries[id] = {
            id: id,
            selected: isFirst,
            messages: [msg]
          };
        }

        isFirst = false;
      });

      // Recalculate filtered array of query ids
      updateEntryIdsByQuery(state);
    },
    clearEntries(state) {
      state.entryIdsByQuery = [];
      state.entries = {};
      state.hasNext = false;
      state.hasPrevious = false;
      state.zeroTime = null;
      state.zeroId = null;
      state.selectedId = null;
    },
    alive(state) {
      state.status = 'Loading messages...';
    },
    dead(state) {
      state.status = 'This website does not use IMA.js';
      state.isLoading = false;
    },
    reload(state) {
      state.status = 'Reloading application...';
      state.isLoading = true;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      updateEntryIdsByQuery(state);
    },
    setSelected(state, action) {
      updateSelected(state, action.payload);
      updateHasPreviousNext(state);
    },
    selectNext(state) {
      if (state.hasNext) {
        const selectedIdIndex = state.entryIdsByQuery.indexOf(state.selectedId);

        updateSelected(state, state.entryIdsByQuery[selectedIdIndex + 1]);
        updateHasPreviousNext(state);
      }
    },
    selectPrevious(state) {
      if (state.hasPrevious) {
        const selectedIdIndex = state.entryIdsByQuery.indexOf(state.selectedId);

        updateSelected(state, state.entryIdsByQuery[selectedIdIndex - 1]);
        updateHasPreviousNext(state);
      }
    }
  }
});

const selectors = {
  getEntriesLength: createSelector(
    state => state.entries.entries,
    entries => entries && Object.keys(entries).length
  )
};

const { reducer, actions } = entries;

export { reducer, actions, selectors };
