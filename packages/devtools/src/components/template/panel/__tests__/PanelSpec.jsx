import React from 'react';
import { shallow } from 'enzyme';
import * as utils from 'services/utils';
import Actions from 'constants/actions';
import Panel from '../Panel';

describe('Panel template', () => {
  const props = {
    alive: jest.fn(),
    dead: jest.fn(),
    unsupported: jest.fn(),
    reload: jest.fn(),
    clearEntries: jest.fn(),
    selectNext: jest.fn(),
    selectPrevious: jest.fn()
  };

  let wrapper, instance, disconnectCallback;

  const createPort = ({ name }) => ({
    name,
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    onDisconnect: {
      addListener: jest
        .fn()
        .mockImplementation(callback => (disconnectCallback = callback))
    }
  });

  global.chrome = {
    runtime: {
      connect: jest.fn().mockImplementation(details => createPort(details))
    }
  };

  utils.getCurrentTab = jest.fn().mockResolvedValue({
    tabId: 123
  });

  beforeEach(() => {
    wrapper = shallow(<Panel {...props} />);
    instance = wrapper.instance();
    instance.setState = jest.fn();
  });

  it('should match snapshot with loader', () => {
    wrapper.setProps({ isLoading: true });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Loader').length).toBe(1);
  });

  it('should match snapshot with error message', () => {
    wrapper.setProps({
      isLoading: false,
      error:
        'The devtools only support applications runnning IMA.js v17 or higher.'
    });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('h4').length).toBe(1);
  });

  it('should match snapshot with SplitPane', () => {
    wrapper.setProps({ isLoading: false });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SplitPane').length).toBe(1);
  });

  describe('defaultProps', () => {
    it('should match snapshot', () => {
      expect(Panel.defaultProps).toMatchSnapshot();
    });
  });

  describe('componentDidMount', () => {
    it('should initialize connection with background script', async () => {
      await instance.componentDidMount();

      expect(chrome.runtime.connect).toHaveBeenCalled();
      expect(chrome.runtime.connect).toHaveBeenCalledWith({
        name: 'panel:123'
      });

      expect(instance.port.onMessage.addListener.mock.calls.length).toBe(1);
      expect(instance.port.onMessage.addListener.mock.calls[0][0]).toBe(
        instance.onMessage
      );

      expect(instance.port.onDisconnect.addListener.mock.calls.length).toBe(1);

      disconnectCallback();

      expect(instance.port.onMessage.removeListener.mock.calls.length).toBe(1);
      expect(instance.port.onMessage.removeListener.mock.calls[0][0]).toBe(
        instance.onMessage
      );
    });
  });

  describe('componentWillUnmount', () => {
    it('should disconnect port and remove listeners', () => {
      window.removeEventListener = jest.fn();
      instance.port.disconnect = jest.fn();

      instance.componentWillUnmount();

      expect(instance.port.disconnect.mock.calls.length).toBe(1);
      expect(window.removeEventListener.mock.calls.length).toBe(1);
      expect(window.removeEventListener.mock.calls[0][0]).toBe('keydown');
      expect(window.removeEventListener.mock.calls[0][1]).toBe(
        instance.onKeyDown
      );
    });
  });

  describe('onKeyDown', () => {
    it('should call selectPrevious on keyUp', () => {
      instance.onKeyDown({ keyCode: 38 });

      expect(instance.props.selectPrevious.mock.calls.length).toBe(1);
    });

    it('should call selectNext on keyDown', () => {
      instance.onKeyDown({ keyCode: 40 });

      expect(instance.props.selectNext.mock.calls.length).toBe(1);
    });
  });

  describe('onMessage', () => {
    beforeEach(() => {
      instance.props.clearEntries.mockClear();
    });

    it('should call alive on alive action', () => {
      instance.onMessage({ action: Actions.ALIVE });

      expect(instance.props.alive.mock.calls.length).toBe(1);
    });

    it('should call reload and clear entries on reloading action', () => {
      instance.onMessage({ action: Actions.RELOADING });

      expect(instance.props.reload.mock.calls.length).toBe(1);
      expect(instance.props.clearEntries.mock.calls.length).toBe(1);
    });

    it('should call unsupported on unsupported action', () => {
      instance.onMessage({ action: Actions.UNSUPPORTED });

      expect(instance.props.unsupported.mock.calls.length).toBe(1);
    });

    it('should call dead and clear entries on dead action', () => {
      instance.onMessage({ action: Actions.DEAD });

      expect(instance.props.dead.mock.calls.length).toBe(1);
      expect(instance.props.clearEntries.mock.calls.length).toBe(1);
    });

    it('should cache and add message on message action', () => {
      instance.cachedEntries.push = jest.fn();
      instance._batchAddEntries = jest.fn();

      instance.onMessage({ action: Actions.MESSAGE });

      expect(instance.cachedEntries.push.mock.calls.length).toBe(1);
      expect(instance.cachedEntries.push.mock.calls[0][0]).toEqual({
        action: Actions.MESSAGE
      });
      expect(instance._batchAddEntries.mock.calls.length).toBe(1);
    });
  });
});
