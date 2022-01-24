import { createSelector, createSlice } from '@reduxjs/toolkit';
import uid from 'easy-uid';

export const presetsInitialState = {
  selectedPresetId: null,
  presets: {},
};

const getCurrentPreset = state => {
  return state.presets[state.selectedPresetId];
};

const presets = createSlice({
  name: 'presets',
  initialState: presetsInitialState,
  reducers: {
    // Presets actions
    setPresets(state, { payload: { presets, selectedPresetId } }) {
      // Reset selected flag
      Object.values(presets).forEach(preset => {
        preset.selected = preset.id === selectedPresetId;
      });

      state.presets = presets;
      state.selectedPresetId = selectedPresetId;
    },
    addPreset(state, { payload }) {
      state.presets[payload.id] = payload;
    },
    renamePreset(state, { payload: { id, name } }) {
      state.presets[id].name = name;
    },
    deletePreset(state, { payload: id }) {
      delete state.presets[id];

      // Select new default
      if (id === state.selectedPresetId) {
        const newSelectedId = Object.keys(state.presets)[0];
        state.selectedPresetId = newSelectedId;
        state.presets[newSelectedId].selected = true;
      }
    },
    copyPreset(state, { payload: id }) {
      const dupePreset = { ...state.presets[id] };

      dupePreset.id = uid();
      dupePreset.name = `Copy of ${dupePreset.name} - ${dupePreset.id.substring(
        0,
        17
      )}`;
      dupePreset.selected = false;
      dupePreset.editable = true;

      state.presets[dupePreset.id] = dupePreset;
    },
    selectPreset(state, { payload: id }) {
      const selectedPreset = Object.values(state.presets).find(p => p.selected);

      if (selectedPreset) {
        selectedPreset.selected = false;
      }

      // Set selected
      state.presets[id].selected = true;
      state.selectedPresetId = id;
    },

    // Hooks actions
    addHook(state, { payload }) {
      getCurrentPreset(state).hooks[payload.id] = payload;
    },
    toggleHook(state, { payload: id }) {
      getCurrentPreset(state).hooks[id].enabled =
        !getCurrentPreset(state).hooks[id].enabled;
    },
    deleteHook(state, { payload: id }) {
      delete getCurrentPreset(state).hooks[id];
    },
    openHook(state, { payload: id }) {
      const hooks = getCurrentPreset(state).hooks;

      if (hooks[id].opened) {
        hooks[id].opened = false;
      } else {
        for (let key in hooks) {
          if (hooks[key].opened) {
            hooks[key].opened = false;
            break;
          }
        }

        hooks[id].opened = true;
      }
    },
  },
});

const selectors = {
  getHookIds: createSelector(
    state => state.presets.selectedPresetId,
    state => state.presets.presets,
    (selectedPresetId, presets) => {
      return selectedPresetId && Object.keys(presets[selectedPresetId].hooks);
    }
  ),
  getActiveHooks: createSelector(
    state => state.presets.selectedPresetId,
    state => state.presets.presets,
    (selectedPresetId, presets) => {
      return selectedPresetId && presets[selectedPresetId].hooks;
    }
  ),
};

const { reducer, actions } = presets;

export { reducer, actions, selectors };
