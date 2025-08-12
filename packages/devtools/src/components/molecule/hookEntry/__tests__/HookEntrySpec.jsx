import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallow } from 'enzyme';

import HookEntry from '../HookEntry';

describe('HookEntry molecule', () => {
  let wrapper, instance;

  const event = {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  };

  const props = {
    id: '0',
    hook: {
      id: '0',
      name: 'name',
      enabled: true,
      opened: false,
    },
    toggleHook: vi.fn(),
    deleteHook: vi.fn(),
    alertSuccess: vi.fn(),
    openHook: vi.fn(),
    showConfirmModal: vi.fn(),
    editable: true,
  };

  beforeEach(() => {
    wrapper = shallow(<HookEntry {...props} />);
    instance = wrapper.instance();
    event.preventDefault.mockClear();
    event.stopPropagation.mockClear();
  });

  describe('onChange', () => {
    it('should extract name form input and set value to state', () => {
      vi.spyOn(instance, 'setState').mockImplementation();
      instance.onChange({
        target: {
          name: 'name__0',
          value: 'newName',
        },
      });

      expect(instance.setState.mock.calls).toHaveLength(1);
      expect(instance.setState.mock.calls[0][0]).toStrictEqual({
        name: 'newName',
      });
    });
  });

  describe('onDelete', () => {
    it('should prevent default and stop propagation', () => {
      instance.onDelete(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(event.stopPropagation.mock.calls).toHaveLength(1);
      instance.props.showConfirmModal.mockClear();
    });

    it('should show confirm modal', () => {
      instance.onDelete(event);

      expect(instance.props.showConfirmModal.mock.calls).toHaveLength(1);
      expect(
        Object.keys(instance.props.showConfirmModal.mock.calls[0][0])
      ).toStrictEqual(['body', 'accept']);
    });
  });

  describe('onEnable', () => {
    it('should call props.toggleHook with id and show alert', () => {
      instance.onEnable(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(event.stopPropagation.mock.calls).toHaveLength(1);
      expect(instance.props.toggleHook.mock.calls).toHaveLength(1);

      expect(instance.props.alertSuccess.mock.calls).toHaveLength(1);
      expect(instance.props.alertSuccess.mock.calls[0][0]).toBe(
        `'name' hook was disabled.`
      );
    });
  });

  describe('onOpen', () => {
    it('should call props.openHook with hook ID', () => {
      instance.onOpen(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);
      expect(instance.props.openHook.mock.calls).toHaveLength(1);
      expect(instance.props.openHook.mock.calls[0][0]).toBe('0');
    });
  });
});
