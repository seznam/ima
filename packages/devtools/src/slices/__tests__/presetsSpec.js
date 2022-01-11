import { presetsInitialState, actions, reducer, selectors } from '../presets';

jest.mock('easy-uid');
import uid from 'easy-uid';

describe('presetsInitialState', () => {
  it('should match snapshot', () => {
    expect(presetsInitialState).toMatchSnapshot();
  });
});

describe('reducer', () => {
  let curState;

  beforeEach(() => {
    curState = {
      selectedPresetId: '0',
      presets: {
        0: {
          id: '0',
          name: 'name',
          hooks: {},
          selected: true
        }
      }
    };
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(presetsInitialState);
  });

  it('should set presets to state', () => {
    expect(
      reducer(curState, {
        type: 'presets/setPresets',
        payload: {
          presets: {
            1: {
              id: '1',
              name: 'name',
              hooks: {},
              selected: true
            }
          },
          selectedPresetId: '1'
        }
      })
    ).toEqual({
      presets: {
        1: {
          id: '1',
          name: 'name',
          hooks: {},
          selected: true
        }
      },
      selectedPresetId: '1'
    });
  });

  it('should add preset to state', () => {
    expect(
      reducer(curState, {
        type: 'presets/addPreset',
        payload: {
          id: '1',
          name: 'name'
        }
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        1: {
          id: '1',
          name: 'name'
        }
      }
    });
  });

  it('should rename existing preset', () => {
    expect(
      reducer(curState, {
        type: 'presets/renamePreset',
        payload: {
          id: '0',
          name: 'newName'
        }
      })
    ).toEqual({
      ...curState,
      presets: {
        0: {
          ...curState.presets['0'],
          name: 'newName'
        }
      }
    });
  });

  it('should remove preset from state', () => {
    curState.selectedPresetId = null;

    expect(
      reducer(curState, {
        type: 'presets/deletePreset',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      presets: {}
    });
  });

  it('should remove preset from state and reset selected ID', () => {
    curState.presets['1'] = {
      id: '1',
      name: 'Name#1'
    };

    expect(
      reducer(curState, {
        type: 'presets/deletePreset',
        payload: '0'
      })
    ).toEqual({
      selectedPresetId: '1',
      presets: {
        1: {
          id: '1',
          name: 'Name#1',
          selected: true
        }
      }
    });
  });

  it('should copy preset with new id', () => {
    uid.mockReturnValue('1');

    expect(
      reducer(curState, {
        type: 'presets/copyPreset',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        1: {
          id: '1',
          name: 'Copy of name - 1',
          selected: false,
          editable: true,
          hooks: {}
        }
      }
    });
  });

  it('should set preset with given id as selected', () => {
    expect(
      reducer(curState, {
        type: 'presets/selectPreset',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          selected: true
        }
      },
      selectedPresetId: '0'
    });
  });

  it('should unselect and select new preset', () => {
    curState.presets['0'].selected = false;
    curState.presets['1'] = {
      id: '1',
      name: 'Name#1',
      selected: true
    };

    expect(
      reducer(curState, {
        type: 'presets/selectPreset',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          selected: true
        },
        1: {
          id: '1',
          name: 'Name#1',
          selected: false
        }
      },
      selectedPresetId: '0'
    });
  });

  it('should add hook to currently selected preset', () => {
    expect(
      reducer(curState, {
        type: 'presets/addHook',
        payload: {
          id: '0',
          name: 'hookName'
        }
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {
            0: {
              id: '0',
              name: 'hookName'
            }
          }
        }
      }
    });
  });

  it('should toggle hook in currently selected preset', () => {
    curState.presets['0'].hooks = {
      0: {
        enabled: false
      }
    };

    expect(
      reducer(curState, {
        type: 'presets/toggleHook',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {
            0: {
              enabled: true
            }
          }
        }
      }
    });
  });

  it('should delete hook in currently selected preset', () => {
    curState.presets['0'].hooks = {
      0: {
        enabled: false
      }
    };

    expect(
      reducer(curState, {
        type: 'presets/deleteHook',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {}
        }
      }
    });
  });

  it('should open hook in currently selected preset', () => {
    curState.presets['0'].hooks = {
      0: {
        opened: false
      }
    };

    expect(
      reducer(curState, {
        type: 'presets/openHook',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {
            0: {
              opened: true
            }
          }
        }
      }
    });
  });

  it('should open hook in currently selected preset and close others', () => {
    curState.presets['0'].hooks = {
      0: {
        opened: false
      },
      1: {
        opened: true
      }
    };

    expect(
      reducer(curState, {
        type: 'presets/openHook',
        payload: '0'
      })
    ).toEqual({
      ...curState,
      presets: {
        ...curState.presets,
        0: {
          ...curState.presets['0'],
          hooks: {
            0: {
              opened: true
            },
            1: {
              opened: false
            }
          }
        }
      }
    });
  });
});

describe('actions', () => {
  it('should create action to set presets', () => {
    expect(
      actions.setPresets({
        presets: 'myPresets',
        selectedPresetId: '0'
      })
    ).toEqual({
      type: 'presets/setPresets',
      payload: {
        presets: 'myPresets',
        selectedPresetId: '0'
      }
    });
  });

  it('should create action to add preset', () => {
    expect(
      actions.addPreset({
        id: '0',
        name: 'preset'
      })
    ).toEqual({
      type: 'presets/addPreset',
      payload: {
        id: '0',
        name: 'preset'
      }
    });
  });

  it('should create action to rename preset', () => {
    expect(
      actions.renamePreset({
        id: '0',
        name: 'newPresetName'
      })
    ).toEqual({
      type: 'presets/renamePreset',
      payload: {
        id: '0',
        name: 'newPresetName'
      }
    });
  });

  it('should create action to delete preset', () => {
    expect(actions.deletePreset('0')).toEqual({
      type: 'presets/deletePreset',
      payload: '0'
    });
  });

  it('should create action to copy preset', () => {
    expect(actions.copyPreset('0')).toEqual({
      type: 'presets/copyPreset',
      payload: '0'
    });
  });

  it('should create action to select preset', () => {
    expect(actions.selectPreset('0')).toEqual({
      type: 'presets/selectPreset',
      payload: '0'
    });
  });

  it('should create action to add hook', () => {
    expect(
      actions.addHook({
        id: '0',
        name: 'hookName'
      })
    ).toEqual({
      type: 'presets/addHook',
      payload: {
        id: '0',
        name: 'hookName'
      }
    });
  });

  it('should create action to toggle hook', () => {
    expect(actions.toggleHook('0')).toEqual({
      type: 'presets/toggleHook',
      payload: '0'
    });
  });

  it('should create action to delete hook', () => {
    expect(actions.deleteHook('0')).toEqual({
      type: 'presets/deleteHook',
      payload: '0'
    });
  });

  it('should create action to open hook', () => {
    expect(actions.openHook('0')).toEqual({
      type: 'presets/openHook',
      payload: '0'
    });
  });
});

describe('selectors', () => {
  it('should match snapshot', () => {
    expect(selectors).toMatchSnapshot();
  });

  describe('getHookIds selector', () => {
    it('should return hook keys from currently selected preset', () => {
      const result = selectors.getHookIds.resultFunc('0', {
        0: {
          hooks: {
            0: {},
            1: {}
          }
        }
      });

      expect(result).toEqual(['0', '1']);
    });

    it('should return null for empty state', () => {
      const result = selectors.getHookIds.resultFunc(null, {});

      expect(result).toBeNull();
    });
  });

  describe('getActiveHooks selector', () => {
    it('should return hooks from currently selected preset', () => {
      const result = selectors.getActiveHooks.resultFunc('0', {
        0: {
          hooks: {
            0: {},
            1: {}
          }
        }
      });

      expect(result).toEqual({
        0: {},
        1: {}
      });
    });

    it('should return null for empty state', () => {
      const result = selectors.getActiveHooks.resultFunc(null, {});

      expect(result).toBeNull();
    });
  });
});
