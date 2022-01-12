import React from 'react';
import { shallow } from 'enzyme';
import Options from '../Options';
import * as settings from 'services/settings';

jest.mock('easy-uid');
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

  beforeEach(() => {
    wrapper = shallow(<Options {...props} />);
    instance = wrapper.instance();
    event.preventDefault.mockClear();
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should match snapshot with modal opened', () => {
    wrapper.setState({
      modalOpened: true,
    });

    expect(wrapper).toMatchSnapshot();
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
      jest
        .spyOn(settings, 'getSettings')
        .mockImplementation()
        .mockImplementation(() => ({
          presets: 'settingsPresets',
          selectedPresetId: '0',
        }));

      await instance.componentDidMount();

      expect(settings.getSettings.mock.calls).toHaveLength(1);
      expect(instance.props.setPresets.mock.calls).toHaveLength(1);
      expect(instance.props.setPresets.mock.calls[0][0]).toStrictEqual({
        presets: 'settingsPresets',
        selectedPresetId: '0',
      });
    });
  });

  describe('onAdd', () => {
    it('should call props.addHook with generated hook', () => {
      jest
        .spyOn(instance, '_createHook')
        .mockImplementation()
        .mockReturnValue('newHook');

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
      jest.spyOn(settings, 'setSettings').mockImplementation();
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

      expect(settings.setSettings.mock.calls).toHaveLength(1);
      expect(settings.setSettings.mock.calls[0][0]).toStrictEqual({
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
