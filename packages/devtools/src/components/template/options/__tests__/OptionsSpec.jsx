/* eslint-disable import/order */
import { shallow } from 'enzyme';

jest.mock('@/utils', () => ({
  setSettings: jest.fn(),
  getSettings: jest.fn().mockReturnValue(Promise.resolve({})),
}));
import * as utils from '@/utils';

import Options from '../Options';

jest.mock('easy-uid');
// eslint-disable-next-line import/order
import uid from 'easy-uid';

describe('Options template', () => {
  let wrapper, instance;

  const event = {
    preventDefault: jest.fn(),
  };

  const props = {
    presets: {
      0: {
        id: '0',
        name: 'name',
        editable: true,
        selected: false,
      },
    },
    setPresets: jest.fn(),
    addHook: jest.fn(),
    alertSuccess: jest.fn(),
    selectedPresetId: '0',
    hookIds: ['1', '2', '3'],
  };

  beforeAll(() => {
    global.chrome = {
      storage: {
        local: {
          get: jest.fn(),
        },
      },
    };
  });

  beforeEach(() => {
    wrapper = shallow(<Options {...props} />, {
      disableLifecycleMethods: true,
    });

    instance = wrapper.instance();
    event.preventDefault.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get isEditable', () => {
    it('should return true if preset is editable', () => {
      expect(instance.isEditable).toBe(true);
    });

    it('should return false if preset is not editable', () => {
      wrapper.setProps({
        presets: {
          ...props.presets,
          0: {
            ...props.presets['0'],
            editable: false,
          },
        },
      });

      expect(instance.isEditable).toBe(false);
    });

    it("should return false if selected preset doesn't exist", () => {
      wrapper.setProps({
        selectedPresetId: null,
      });

      expect(instance.isEditable).toBe(false);
    });
  });

  describe('componentDidMount', () => {
    it('should fetch and set settings on mount', async () => {
      jest.spyOn(utils, 'getSettings').mockImplementation(() =>
        Promise.resolve({
          presets: 'settingsPresets',
          selectedPresetId: '0',
        })
      );

      await instance.componentDidMount();

      expect(utils.getSettings.mock.calls).toHaveLength(1);
      expect(instance.props.setPresets.mock.calls).toHaveLength(1);
      expect(instance.props.setPresets.mock.calls[0][0]).toStrictEqual({
        presets: 'settingsPresets',
        selectedPresetId: '0',
      });
    });
  });

  describe('onAdd', () => {
    it('should call props.addHook with generated hook', () => {
      jest.spyOn(instance, '_createHook').mockReturnValue('newHook');

      instance.onAdd(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(instance.props.addHook.mock.calls).toHaveLength(1);
      expect(instance.props.addHook.mock.calls[0][0]).toBe('newHook');
      expect(instance._createHook.mock.calls).toHaveLength(1);
    });
  });

  describe('onLoadPreset', () => {
    it('should open presets modal window', () => {
      jest.spyOn(instance, 'setState').mockImplementation();

      instance.onLoadPreset(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(instance.setState.mock.calls).toHaveLength(1);
      expect(instance.setState.mock.calls[0][0]).toStrictEqual({
        modalOpened: true,
      });
    });
  });

  describe('onModalClose', () => {
    it('should closeModalWindow', () => {
      jest.spyOn(instance, 'setState').mockImplementation();

      instance.onModalClose();

      expect(instance.setState.mock.calls).toHaveLength(1);
      expect(instance.setState.mock.calls[0][0]).toStrictEqual({
        modalOpened: false,
      });
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      jest.spyOn(utils, 'setSettings').mockImplementation();
      global.FormData = function () {
        return {
          entries: jest.fn().mockImplementation(() => {
            return [['name__0', 'newName']];
          }),
        };
      };

      instance.props.alertSuccess.mockClear();
    });

    it('should call set settings with new extracted data', () => {
      instance.onSubmit(event);

      expect(utils.setSettings.mock.calls).toHaveLength(1);
      expect(utils.setSettings.mock.calls[0][0]).toStrictEqual({
        presets: {
          ...props.presets,
          0: {
            ...props.presets['0'],
            hooks: {
              0: {
                name: 'newName',
              },
            },
          },
        },
        selectedPresetId: props.selectedPresetId,
      });
    });

    it('should show success alert', () => {
      instance.onSubmit(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(instance.props.alertSuccess.mock.calls).toHaveLength(1);
      expect(instance.props.alertSuccess.mock.calls[0][0]).toBe(
        'Changes were saved.'
      );
    });
  });

  describe('_createHook', () => {
    it('should create blank hook object with generated ID', () => {
      uid.mockReturnValue('2fghzj-123456');

      expect(instance._createHook()).toStrictEqual({
        id: '2fghzj-123456',
        enabled: false,
        opened: false,
        name: 'Hook - 2fghzj',
        description: 'Description for hook - 2fghzj',
        code: '',
      });
    });
  });
});
