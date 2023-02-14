/* eslint-disable import/order */
import { shallow } from 'enzyme';

jest.mock('@/utils');
import * as settings from '@/utils';

import PresetsModal from '../PresetsModal';

jest.mock('easy-uid');
// eslint-disable-next-line import/order
import uid from 'easy-uid';

describe('PresetsModal organism', () => {
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
    selectedPresetId: '0',
    addPreset: jest.fn(),
    selectPreset: jest.fn(),
    alertSuccess: jest.fn(),
    onClose: jest.fn(),
    opened: true,
  };

  beforeEach(() => {
    wrapper = shallow(<PresetsModal {...props} />);
    instance = wrapper.instance();
    event.preventDefault.mockClear();
  });

  describe('onCreatePreset', () => {
    it('should call props.addPreset with blank preset', () => {
      jest
        .spyOn(instance, '_createPreset')
        .mockImplementation()
        .mockReturnValue('newPreset');

      instance.onCreatePreset(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(instance.props.addPreset.mock.calls).toHaveLength(1);
      expect(instance.props.addPreset.mock.calls[0][0]).toBe('newPreset');
      expect(instance._createPreset.mock.calls).toHaveLength(1);
    });
  });

  describe('onSaveChanges', () => {
    it('should save changes to chrome.local.storage', () => {
      jest.spyOn(settings, 'setSettings').mockImplementation();

      instance.onSaveChanges(event);

      expect(settings.setSettings.mock.calls).toHaveLength(1);
      expect(settings.setSettings.mock.calls[0][0]).toStrictEqual({
        presets: props.presets,
        selectedPresetId: props.selectedPresetId,
      });

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(instance.props.alertSuccess.mock.calls).toHaveLength(1);
      expect(instance.props.alertSuccess.mock.calls[0][0]).toBe(
        'Changes made to the presets were saved.'
      );
    });
  });

  describe('onSelect', () => {
    it('should call props.selectPreset with preset id', () => {
      instance.onSelect('2fghzj');

      expect(instance.props.selectPreset.mock.calls).toHaveLength(1);
      expect(instance.props.selectPreset.mock.calls[0][0]).toBe('2fghzj');
      expect(instance.props.onClose.mock.calls).toHaveLength(1);
    });
  });

  describe('_createPreset', () => {
    it('should create blank preset object with generated ID', () => {
      uid.mockReturnValue('2fghzj-123456');

      expect(instance._createPreset()).toStrictEqual({
        id: '2fghzj-123456',
        name: 'Preset - 2fghzj',
        editable: true,
        selected: false,
        hooks: {},
      });
    });
  });
});
