import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  presetsInitialState,
  presetsActions,
  presetsReducer,
  presetsSelectors,
} from '../presets';

vi.mock('easy-uid');
// eslint-disable-next-line import/order
import uid from 'easy-uid';

describe('presetsReducer', () => {
  let curState;

  beforeEach(() => {
    curState = {
      selectedPresetId: '0',
      presets: {
        0: {
          id: '0',
          name: 'name',
          hooks: {},
          selected: true,
        },
      },
    };
  });

  it('should return the initial state', () => {
    expect(presetsReducer(undefined, {})).toStrictEqual(presetsInitialState);
  });

  it('should set presets to state', () => {
    expect(
      presetsReducer(curState, {
        type: 'presets/setPresets',
        payload: {
          presets: {
            1: {
              id: '1',
              name: 'name',
              hooks: {},
              selected: true,
            },
          },
          selectedPresetId: '1',
        },
      })
    ).toStrictEqual({
      presets: {
        1: {
          id: '1',
          name: 'name',
          hooks: {},
          selected: true,
        },
      },
      selectedPresetId: '1',
    });
  });

  it('should add preset to state', () => {
    expect(
      presetsReducer(curState, {
        type: 'presets/addPreset',
        payload: {
          id: '1',
          name: 'name',
        },
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        1: {
          id: '1',
          name: 'name',
        },
      },
    });
  });

  it('should rename existing preset', () => {
    expect(
      presetsReducer(curState, {
        type: 'presets/renamePreset',
        payload: {
          id: '0',
          name: 'newName',
        },
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        0: {
          ...curState.presets['0'],
          name: 'newName',
        },
      },
    });
  });

  it('should remove preset from state', () => {
    curState.selectedPresetId = null;

    expect(
      presetsReducer(curState, {
        type: 'presets/deletePreset',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      presets: {},
    });
  });

  it('should remove preset from state and reset selected ID', () => {
    curState.presets['1'] = {
      id: '1',
      name: 'Name#1',
    };

    expect(
      presetsReducer(curState, {
        type: 'presets/deletePreset',
        payload: '0',
      })
    ).toStrictEqual({
      selectedPresetId: '1',
      presets: {
        1: {
          id: '1',
          name: 'Name#1',
          selected: true,
        },
      },
    });
  });

  it('should copy preset with new id', () => {
    uid.mockReturnValue('1');

    expect(
      presetsReducer(curState, {
        type: 'presets/copyPreset',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        1: {
          id: '1',
          name: 'Copy of name - 1',
          selected: false,
          editable: true,
          hooks: {},
        },
      },
    });
  });

  it('should set preset with given id as selected', () => {
    expect(
      presetsReducer(curState, {
        type: 'presets/selectPreset',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          selected: true,
        },
      },
      selectedPresetId: '0',
    });
  });

  it('should unselect and select new preset', () => {
    curState.presets['0'].selected = false;
    curState.presets['1'] = {
      id: '1',
      name: 'Name#1',
      selected: true,
    };

    expect(
      presetsReducer(curState, {
        type: 'presets/selectPreset',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          selected: true,
        },
        1: {
          id: '1',
          name: 'Name#1',
          selected: false,
        },
      },
      selectedPresetId: '0',
    });
  });

  it('should add hook to currently selected preset', () => {
    expect(
      presetsReducer(curState, {
        type: 'presets/addHook',
        payload: {
          id: '0',
          name: 'hookName',
        },
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {
            0: {
              id: '0',
              name: 'hookName',
            },
          },
        },
      },
    });
  });

  it('should toggle hook in currently selected preset', () => {
    curState.presets['0'].hooks = {
      0: {
        enabled: false,
      },
    };

    expect(
      presetsReducer(curState, {
        type: 'presets/toggleHook',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {
            0: {
              enabled: true,
            },
          },
        },
      },
    });
  });

  it('should delete hook in currently selected preset', () => {
    curState.presets['0'].hooks = {
      0: {
        enabled: false,
      },
    };

    expect(
      presetsReducer(curState, {
        type: 'presets/deleteHook',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {},
        },
      },
    });
  });

  it('should open hook in currently selected preset', () => {
    curState.presets['0'].hooks = {
      0: {
        opened: false,
      },
    };

    expect(
      presetsReducer(curState, {
        type: 'presets/openHook',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {
            0: {
              opened: true,
            },
          },
        },
      },
    });
  });

  it('should open hook in currently selected preset and close others', () => {
    curState.presets['0'].hooks = {
      0: {
        opened: false,
      },
      1: {
        opened: true,
      },
    };

    expect(
      presetsReducer(curState, {
        type: 'presets/openHook',
        payload: '0',
      })
    ).toStrictEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {
            0: {
              opened: true,
            },
            1: {
              opened: false,
            },
          },
        },
      },
    });
  });
});

describe('presetsActions', () => {
  it('should create action to set presets', () => {
    expect(
      presetsActions.setPresets({
        presets: 'myPresets',
        selectedPresetId: '0',
      })
    ).toStrictEqual({
      type: 'presets/setPresets',
      payload: {
        presets: 'myPresets',
        selectedPresetId: '0',
      },
    });
  });

  it('should create action to add preset', () => {
    expect(
      presetsActions.addPreset({
        id: '0',
        name: 'preset',
      })
    ).toStrictEqual({
      type: 'presets/addPreset',
      payload: {
        id: '0',
        name: 'preset',
      },
    });
  });

  it('should create action to rename preset', () => {
    expect(
      presetsActions.renamePreset({
        id: '0',
        name: 'newPresetName',
      })
    ).toStrictEqual({
      type: 'presets/renamePreset',
      payload: {
        id: '0',
        name: 'newPresetName',
      },
    });
  });

  it('should create action to delete preset', () => {
    expect(presetsActions.deletePreset('0')).toStrictEqual({
      type: 'presets/deletePreset',
      payload: '0',
    });
  });

  it('should create action to copy preset', () => {
    expect(presetsActions.copyPreset('0')).toStrictEqual({
      type: 'presets/copyPreset',
      payload: '0',
    });
  });

  it('should create action to select preset', () => {
    expect(presetsActions.selectPreset('0')).toStrictEqual({
      type: 'presets/selectPreset',
      payload: '0',
    });
  });

  it('should create action to add hook', () => {
    expect(
      presetsActions.addHook({
        id: '0',
        name: 'hookName',
      })
    ).toStrictEqual({
      type: 'presets/addHook',
      payload: {
        id: '0',
        name: 'hookName',
      },
    });
  });

  it('should create action to toggle hook', () => {
    expect(presetsActions.toggleHook('0')).toStrictEqual({
      type: 'presets/toggleHook',
      payload: '0',
    });
  });

  it('should create action to delete hook', () => {
    expect(presetsActions.deleteHook('0')).toStrictEqual({
      type: 'presets/deleteHook',
      payload: '0',
    });
  });

  it('should create action to open hook', () => {
    expect(presetsActions.openHook('0')).toStrictEqual({
      type: 'presets/openHook',
      payload: '0',
    });
  });
});

describe('presetsSelectors', () => {
  describe('getHookIds selector', () => {
    it('should return hook keys from currently selected preset', () => {
      const result = presetsSelectors.getHookIds.resultFunc('0', {
        0: {
          hooks: {
            0: {},
            1: {},
          },
        },
      });

      expect(result).toStrictEqual(['0', '1']);
    });

    it('should return null for empty state', () => {
      const result = presetsSelectors.getHookIds.resultFunc(null, {});

      expect(result).toBeNull();
    });
  });

  describe('getActiveHooks selector', () => {
    it('should return hooks from currently selected preset', () => {
      const result = presetsSelectors.getActiveHooks.resultFunc('0', {
        0: {
          hooks: {
            0: {},
            1: {},
          },
        },
      });

      expect(result).toStrictEqual({
        0: {},
        1: {},
      });
    });

    it('should return null for empty state', () => {
      const result = presetsSelectors.getActiveHooks.resultFunc(null, {});

      expect(result).toBeNull();
    });
  });
});
