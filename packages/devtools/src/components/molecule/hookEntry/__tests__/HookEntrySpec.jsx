import React from 'react';
import { shallow } from 'enzyme';
import HookEntry from '../HookEntry';

describe('HookEntry molecule', () => {
  let wrapper, instance;

  const event = {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  };

  const props = {
    id: '0',
    hook: {
      id: '0',
      name: 'name',
      enabled: true,
      opened: false
    },
    toggleHook: jest.fn(),
    deleteHook: jest.fn(),
    alertSuccess: jest.fn(),
    openHook: jest.fn(),
    showConfirmModal: jest.fn(),
    editable: true
  };

  beforeEach(() => {
    wrapper = shallow(<HookEntry {...props} />);
    instance = wrapper.instance();
    event.preventDefault.mockClear();
    event.stopPropagation.mockClear();
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should match snapshot when not in editable state', () => {
    wrapper.setProps({ editable: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should match snapshot when opened', () => {
    wrapper.setProps({
      hook: {
        ...props.hook,
        opened: true
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  describe('onChange', () => {
    it('should extract name form input and set value to state', () => {
      instance.setState = jest.fn();
      instance.onChange({
        target: {
          name: 'name__0',
          value: 'newName'
        }
      });

      expect(instance.setState.mock.calls.length).toBe(1);
      expect(instance.setState.mock.calls[0][0]).toEqual({
        name: 'newName'
      });
    });
  });

  describe('onDelete', () => {
    it('should prevent default and stop propagation', () => {
      instance.onDelete(event);

      expect(event.preventDefault.mock.calls.length).toBe(1);
      expect(event.stopPropagation.mock.calls.length).toBe(1);
      instance.props.showConfirmModal.mockClear();
    });

    it('should show confirm modal', () => {
      instance.onDelete(event);

      expect(instance.props.showConfirmModal.mock.calls.length).toBe(1);
      expect(
        Object.keys(instance.props.showConfirmModal.mock.calls[0][0])
      ).toEqual(['body', 'accept']);
    });
  });

  describe('onEnable', () => {
    it('should call props.toggleHook with id and show alert', () => {
      instance.onEnable(event);

      expect(event.preventDefault.mock.calls.length).toBe(1);
      expect(event.stopPropagation.mock.calls.length).toBe(1);
      expect(instance.props.toggleHook.mock.calls.length).toBe(1);

      expect(instance.props.alertSuccess.mock.calls.length).toBe(1);
      expect(instance.props.alertSuccess.mock.calls[0][0]).toBe(
        `'name' hook was disabled.`
      );
    });
  });

  describe('onOpen', () => {
    it('should call props.openHook with hook ID', () => {
      instance.onOpen(event);

      expect(event.preventDefault.mock.calls.length).toBe(1);
      expect(instance.props.openHook.mock.calls.length).toBe(1);
      expect(instance.props.openHook.mock.calls[0][0]).toBe('0');
    });
  });
});
