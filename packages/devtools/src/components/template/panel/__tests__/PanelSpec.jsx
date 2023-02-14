/* eslint-disable import/order */
import { shallow } from 'enzyme';

import { Actions } from '@/constants';

jest.mock('@/utils');
import * as utils from '@/utils';

import Panel from '../Panel';

describe('Panel template', () => {
  const props = {
    alive: jest.fn(),
    dead: jest.fn(),
    unsupported: jest.fn(),
    reload: jest.fn(),
    clearEntries: jest.fn(),
    selectNext: jest.fn(),
    selectPrevious: jest.fn(),
  };

  let wrapper, instance, disconnectCallback;

  const createPort = ({ name }) => ({
    name,
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    disconnect: jest.fn(),
    onDisconnect: {
      addListener: jest
        .fn()
        .mockImplementation(callback => (disconnectCallback = callback)),
    },
  });

  global.chrome = {
    runtime: {
      connect: jest.fn().mockImplementation(details => createPort(details)),
    },
  };

  jest.spyOn(utils, 'getCurrentTab').mockImplementation().mockResolvedValue({
    tabId: 123,
  });

  beforeEach(() => {
    wrapper = shallow(<Panel {...props} />);
    instance = wrapper.instance();
    jest.spyOn(instance, 'setState').mockImplementation();
  });

  it('should render with loader', () => {
    wrapper.setProps({ isLoading: true });

    expect(wrapper.find('Loader')).toHaveLength(1);
  });

  it('should render with error message', () => {
    wrapper.setProps({
      isLoading: false,
      error:
        'The devtools only support applications runnning IMA.js v17 or higher.',
    });

    expect(wrapper.find('h4')).toHaveLength(1);
  });

  it('should render with SplitPane', () => {
    wrapper.setProps({ isLoading: false });

    expect(wrapper.find('SplitPane')).toHaveLength(1);
  });

  describe('componentDidMount', () => {
    it('should initialize connection with background script', async () => {
      await instance.componentDidMount();

      expect(chrome.runtime.connect).toHaveBeenCalled();
      expect(chrome.runtime.connect).toHaveBeenCalledWith({
        name: 'panel:123',
      });

      expect(instance.port.onMessage.addListener.mock.calls).toHaveLength(1);
      expect(instance.port.onMessage.addListener.mock.calls[0][0]).toBe(
        instance.onMessage
      );

      expect(instance.port.onDisconnect.addListener.mock.calls).toHaveLength(1);

      disconnectCallback();

      expect(instance.port.onMessage.removeListener.mock.calls).toHaveLength(1);
      expect(instance.port.onMessage.removeListener.mock.calls[0][0]).toBe(
        instance.onMessage
      );
    });
  });

  describe('componentWillUnmount', () => {
    it('should disconnect port and remove listeners', () => {
      jest.spyOn(window, 'removeEventListener').mockImplementation();
      jest.spyOn(instance.port, 'disconnect').mockImplementation();

      instance.componentWillUnmount();

      expect(instance.port.disconnect.mock.calls).toHaveLength(1);
      expect(window.removeEventListener.mock.calls).toHaveLength(1);
      expect(window.removeEventListener.mock.calls[0][0]).toBe('keydown');
      expect(window.removeEventListener.mock.calls[0][1]).toBe(
        instance.onKeyDown
      );
    });
  });

  describe('onKeyDown', () => {
    it('should call selectPrevious on keyUp', () => {
      instance.onKeyDown({ keyCode: 38 });

      expect(instance.props.selectPrevious.mock.calls).toHaveLength(1);
    });

    it('should call selectNext on keyDown', () => {
      instance.onKeyDown({ keyCode: 40 });

      expect(instance.props.selectNext.mock.calls).toHaveLength(1);
    });
  });

  describe('onMessage', () => {
    beforeEach(() => {
      instance.props.clearEntries.mockClear();
    });

    it('should call alive on alive action', () => {
      instance.onMessage({ action: Actions.ALIVE });

      expect(instance.props.alive.mock.calls).toHaveLength(1);
    });

    it('should call reload and clear entries on reloading action', () => {
      instance.onMessage({ action: Actions.RELOADING });

      expect(instance.props.reload.mock.calls).toHaveLength(1);
      expect(instance.props.clearEntries.mock.calls).toHaveLength(1);
    });

    it('should call unsupported on unsupported action', () => {
      instance.onMessage({ action: Actions.UNSUPPORTED });

      expect(instance.props.unsupported.mock.calls).toHaveLength(1);
    });

    it('should call dead and clear entries on dead action', () => {
      instance.onMessage({ action: Actions.DEAD });

      expect(instance.props.dead.mock.calls).toHaveLength(1);
      expect(instance.props.clearEntries.mock.calls).toHaveLength(1);
    });

    it('should cache and add message on message action', () => {
      jest.spyOn(instance.cachedEntries, 'push').mockImplementation();
      jest.spyOn(instance, '_batchAddEntries').mockImplementation();

      instance.onMessage({ action: Actions.MESSAGE });

      expect(instance.cachedEntries.push.mock.calls).toHaveLength(1);
      expect(instance.cachedEntries.push.mock.calls[0][0]).toStrictEqual({
        action: Actions.MESSAGE,
      });
      expect(instance._batchAddEntries.mock.calls).toHaveLength(1);
    });
  });
});
