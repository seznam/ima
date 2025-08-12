import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Actions, State } from '@/constants';

import { TabConnection, CACHE_SIZE } from '../TabConnection';

vi.mock('@/utils', () => ({
  setIcon: vi.fn(),
}));

// // eslint-disable-next-line import/order
// import * as utils from '@/utils';

describe('TabConnection', () => {
  let instance = null;
  const tabId = 123;
  const mockPort = name => ({
    name,
    postMessage: vi.fn(),
    disconnect: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListeners: vi.fn(),
    },
    onDisconnect: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListeners: vi.fn(),
    },
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize defaults', () => {
      instance = new TabConnection(tabId);

      expect(instance.tabId).toBe(tabId);
      expect(instance.cache).toStrictEqual([]);
      expect(instance.state).toBe(State.RELOAD);
      expect(instance.appData).toBeNull();
      expect(instance.domain).toBeNull();
      expect(instance._emptyListener).toBeNull();
      expect(instance._settingsListener).toBeNull();
    });
  });

  describe('addPort', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
      vi.spyOn(instance, '_onDisconnect').mockImplementation();
      vi.spyOn(instance, '_reviveDevtools').mockImplementation();
      vi.spyOn(instance, '_notifyPopup').mockImplementation();
      vi.spyOn(instance, '_createPipe')
        .mockImplementation()
        .mockImplementation(() => (instance.ports.pipeCreated = true));
    });

    it('should save reference to added port', () => {
      let portDevtools = mockPort('devtools');
      let portContentScript = mockPort('contentScript');
      let portPanel = mockPort('panel');
      let portPopup = mockPort('popup');

      instance.addPort('devtools', portDevtools);
      instance.addPort('contentScript', portContentScript);
      instance.addPort('panel', portPanel);
      instance.addPort('popup', portPopup);

      expect(instance.ports.devtools).toBe(portDevtools);
      expect(instance.ports.contentScript).toBe(portContentScript);
      expect(instance.ports.panel).toBe(portPanel);
      expect(instance.ports.popup).toBe(portPopup);
    });

    it('should revive devtools when adding devtools port', () => {
      let port = mockPort('devtools');
      instance.addPort('devtools', port);

      expect(instance._reviveDevtools.mock.calls).toHaveLength(1);
    });

    it('should assign correct listeners to content script', () => {
      let port = mockPort('contentScript');
      instance.addPort('contentScript', port);

      expect(
        instance.ports.contentScript.onMessage.addListener.mock.calls
      ).toHaveLength(2);
      expect(
        instance.ports.contentScript.onMessage.addListener.mock.calls[0][0]
      ).toBe(instance._aliveCallback);
      expect(
        instance.ports.contentScript.onMessage.addListener.mock.calls[1][0]
      ).toBe(instance._cacheMessagesCallback);

      expect(
        instance.ports.contentScript.onDisconnect.addListener.mock.calls
      ).toHaveLength(1);
    });

    it('should remove additional callbacks in contentScript onDisconnect', () => {
      let disconnectListener;
      let port = mockPort('contentScript');
      vi.spyOn(port.onDisconnect, 'addListener')
        .mockImplementation()
        .mockImplementation(listener => {
          disconnectListener = listener;
        });

      instance.addPort('contentScript', port);

      expect(
        instance.ports.contentScript.onDisconnect.addListener.mock.calls
      ).toHaveLength(1);

      disconnectListener();

      expect(instance._onDisconnect.mock.calls).toHaveLength(1);
      expect(instance._onDisconnect.mock.calls[0][0]).toBe('contentScript');
      expect(instance._onDisconnect.mock.calls[0][1]).toBe(
        instance._aliveCallback
      );
      expect(instance._onDisconnect.mock.calls[0][2]).toBe(
        instance._cacheMessagesCallback
      );
    });

    it('should assign listeners and notify popup', () => {
      let port = mockPort('popup');
      instance.addPort('popup', port);

      expect(instance._notifyPopup.mock.calls).toHaveLength(1);

      expect(
        instance.ports.popup.onMessage.addListener.mock.calls
      ).toHaveLength(1);
      expect(instance.ports.popup.onMessage.addListener.mock.calls[0][0]).toBe(
        instance._settingsCallback
      );

      expect(
        instance.ports.popup.onDisconnect.addListener.mock.calls
      ).toHaveLength(1);
    });

    it('should remove additional callbacks in popup onDisconnect', () => {
      let disconnectListener;
      let port = mockPort('popup');
      vi.spyOn(port.onDisconnect, 'addListener')
        .mockImplementation()
        .mockImplementation(listener => {
          disconnectListener = listener;
        });

      instance.addPort('popup', port);

      expect(
        instance.ports.popup.onDisconnect.addListener.mock.calls
      ).toHaveLength(1);

      disconnectListener();

      expect(instance._onDisconnect.mock.calls).toHaveLength(1);
      expect(instance._onDisconnect.mock.calls[0][0]).toBe('popup');
      expect(instance._onDisconnect.mock.calls[0][1]).toBe(
        instance._settingsCallback
      );
    });

    it('should create pipe between panel and content script', () => {
      expect(instance.ports.pipeCreated).toBe(false);

      instance.addPort('contentScript', mockPort('contentScript'));
      instance.addPort('panel', mockPort('panel'));

      expect(instance.ports.pipeCreated).toBe(true);
      expect(instance._createPipe.mock.calls).toHaveLength(1);
    });

    it("should not create pipe if it's already created", () => {
      let portContentScript = mockPort('contentScript');
      let portPanel = mockPort('panel');

      expect(instance.ports.pipeCreated).toBe(false);
      instance.addPort('contentScript', portContentScript);
      instance.addPort('panel', portPanel);

      expect(instance.ports.pipeCreated).toBe(true);
      expect(instance._createPipe.mock.calls).toHaveLength(1);
      expect(instance._createPipe.mock.calls).toHaveLength(1);

      instance.addPort('panel', portPanel);
      expect(instance._createPipe.mock.calls).toHaveLength(1);
      expect(instance.ports.pipeCreated).toBe(true);
    });
  });

  describe('notify', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
    });

    it('should notify only those ports that have any onMessage listener registered', () => {
      instance.ports.panel = mockPort('panel');
      instance.ports.popup = mockPort('popup');
      vi.spyOn(instance.ports.panel.onMessage, 'hasListeners')
        .mockImplementation()
        .mockImplementation(() => true);
      vi.spyOn(instance.ports.popup.onMessage, 'hasListeners')
        .mockImplementation()
        .mockImplementation(() => false);

      instance.notify('message');

      expect(
        instance.ports.panel.onMessage.hasListeners.mock.calls
      ).toHaveLength(1);
      expect(instance.ports.panel.postMessage.mock.calls).toHaveLength(1);
      expect(instance.ports.panel.postMessage.mock.calls[0][0]).toBe('message');

      expect(
        instance.ports.popup.onMessage.hasListeners.mock.calls
      ).toHaveLength(1);
      expect(instance.ports.popup.postMessage.mock.calls).toHaveLength(0);
    });
  });

  describe('disconnect', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
    });

    it('should disconnect all registered ports', () => {
      instance.ports.panel = mockPort('panel');
      instance.ports.popup = mockPort('popup');

      instance.disconnect();

      expect(instance.ports.panel.disconnect.mock.calls).toHaveLength(1);
      expect(instance.ports.popup.disconnect.mock.calls).toHaveLength(1);
    });

    it('should set new domain if available', () => {
      instance.domain = 'old.com';
      instance.reload('new.com');

      expect(instance.domain).toBe('new.com');

      instance.domain = 'old.com';
      instance.reload();

      expect(instance.domain).toBe('old.com');
    });

    it('should clear cache', () => {
      instance.cache = [1, 2, 3];

      instance.reload('domain');

      expect(instance.cache).toHaveLength(0);
    });

    it('should call notify with reloading action', () => {
      vi.spyOn(instance, 'notify').mockImplementation();

      instance.reload('domain');

      expect(instance.notify.mock.calls).toHaveLength(1);
      expect(instance.notify.mock.calls[0][0]).toStrictEqual({
        action: Actions.RELOADING,
      });
    });
  });

  describe('addOnEmptyListener', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
    });

    it('should assign callback to _emptyListener property', () => {
      const callback = () => {};

      expect(instance._emptyListener).toBeNull();
      instance.addOnEmptyListener(callback);
      expect(instance._emptyListener).toBe(callback);
    });
  });

  describe('addOnSettingsListener', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
    });

    it('should assign callback to settingsListener property', () => {
      const callback = () => {};

      expect(instance._settingsListener).toBeNull();
      instance.addOnSettingsListener(callback);
      expect(instance._settingsListener).toBe(callback);
    });
  });

  describe('isEmpty', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
    });

    it('should true if all ports are empty', () => {
      expect(instance.isEmpty()).toBe(true);
    });

    it('should false if at least one port is not empty', () => {
      instance.ports.popup = mockPort('popup');

      expect(instance.isEmpty()).toBe(false);
    });
  });

  describe('resendCache', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
      instance.ports.panel = mockPort('panel');
    });

    it('should not do anything if cache is empty', () => {
      instance.resendCache();

      expect(instance.cache).toHaveLength(0);
      expect(instance.ports.panel.postMessage.mock.calls).toHaveLength(0);
    });

    it('should resend cache content to panel', () => {
      let receivedCache = [];
      instance.cache = [1, 2, 3, 4];
      vi.spyOn(instance.ports.panel, 'postMessage')
        .mockImplementation()
        .mockImplementation(value => receivedCache.push(value));

      instance.resendCache();

      expect(instance.cache).toHaveLength(4);
      expect(instance.ports.panel.postMessage.mock.calls).toHaveLength(4);
      expect(receivedCache).toStrictEqual(instance.cache);
    });
  });

  describe('_notifyPopup', () => {
    it('should send message to popup with current state and app data', () => {
      instance = new TabConnection(tabId);
      instance.ports.popup = mockPort('popup');
      instance.appData = { version: 1 };

      instance._notifyPopup();

      expect(instance.ports.popup.postMessage.mock.calls).toHaveLength(1);
      expect(instance.ports.popup.postMessage.mock.calls[0][0]).toStrictEqual({
        action: Actions.POPUP,
        payload: { state: instance.state, appData: instance.appData },
      });
    });
  });

  describe('_reviveDevtools', () => {
    it('should not do anything if state is not alive', () => {
      instance = new TabConnection(tabId);
      instance.ports.devtools = mockPort('devtools');
      instance.state = State.DEAD;

      instance._reviveDevtools();

      expect(instance.ports.devtools.postMessage.mock.calls).toHaveLength(0);
    });

    it('should post message to devtools and disconnect the port', () => {
      let postMessageCall;
      let disconnectCalled;

      instance = new TabConnection(tabId);
      instance.state = State.ALIVE;
      instance.ports.devtools = mockPort('devtools');
      instance.ports.devtools.postMessage = value => {
        postMessageCall = value;
      };
      instance.ports.devtools.disconnect = () => {
        disconnectCalled = true;
      };

      instance._reviveDevtools();

      expect(postMessageCall).toStrictEqual({
        action: Actions.ALIVE,
      });
      expect(disconnectCalled).toBe(true);
      expect(instance.ports.devtools).toBeNull();
    });
  });

  describe('_createPipe', () => {
    let resendContentScript, resendPanel, shutdownContentScript, shutdownPanel;

    beforeEach(() => {
      instance = new TabConnection(tabId);
      vi.spyOn(instance, '_onDisconnect').mockImplementation();
      vi.spyOn(instance, 'resendCache').mockImplementation();
      instance.ports.contentScript = mockPort('contentScript');
      instance.ports.panel = mockPort('panel');

      // Catch created listeners
      vi.spyOn(instance.ports.contentScript.onMessage, 'addListener')
        .mockImplementation()
        .mockImplementation(listener => {
          resendContentScript = listener;
        });
      vi.spyOn(instance.ports.panel.onMessage, 'addListener')
        .mockImplementation()
        .mockImplementation(listener => {
          resendPanel = listener;
        });
      vi.spyOn(instance.ports.contentScript.onDisconnect, 'addListener')
        .mockImplementation()
        .mockImplementation(listener => {
          shutdownContentScript = listener;
        });
      vi.spyOn(instance.ports.panel.onDisconnect, 'addListener')
        .mockImplementation()
        .mockImplementation(listener => {
          shutdownPanel = listener;
        });
    });

    it('should assign onMessage listeners', () => {
      instance._createPipe();

      expect(
        instance.ports.contentScript.onMessage.addListener.mock.calls
      ).toHaveLength(1);
      expect(
        instance.ports.panel.onMessage.addListener.mock.calls
      ).toHaveLength(1);
    });

    it('should assign onDisconnect listeners', () => {
      instance._createPipe();

      expect(
        instance.ports.contentScript.onDisconnect.addListener.mock.calls
      ).toHaveLength(1);
      expect(
        instance.ports.panel.onDisconnect.addListener.mock.calls
      ).toHaveLength(1);
    });

    it('should send cache and set pipeCreated', () => {
      expect(instance.ports.pipeCreated).toBe(false);
      instance._createPipe();

      expect(instance.resendCache.mock.calls).toHaveLength(1);
      expect(instance.ports.pipeCreated).toBe(true);
    });

    it('should call _onDisconnect and reset pipe on disconnect', () => {
      instance._createPipe();
      shutdownContentScript();

      expect(instance._onDisconnect.mock.calls).toHaveLength(1);
      expect(instance._onDisconnect.mock.calls[0][0]).toBe('contentScript');
      expect(instance._onDisconnect.mock.calls[0][1]).toBe(resendContentScript);

      shutdownPanel();

      expect(instance._onDisconnect.mock.calls).toHaveLength(2);
      expect(instance._onDisconnect.mock.calls[1][0]).toBe('panel');
      expect(instance._onDisconnect.mock.calls[1][1]).toBe(resendPanel);
    });

    it('should resend message from panel to content script', () => {
      instance._createPipe();
      resendPanel('test message');

      expect(instance.ports.contentScript.postMessage.mock.calls).toHaveLength(
        1
      );
      expect(instance.ports.contentScript.postMessage.mock.calls[0][0]).toBe(
        'test message'
      );
    });

    it('should resend message from content script to panel', () => {
      instance._createPipe();
      resendContentScript('test message');

      expect(instance.ports.panel.postMessage.mock.calls).toHaveLength(1);
      expect(instance.ports.panel.postMessage.mock.calls[0][0]).toBe(
        'test message'
      );
    });
  });

  describe('_onDisconnect', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
      instance.ports.popup = mockPort('popup');
      vi.spyOn(instance.ports.popup.onMessage, 'hasListeners')
        .mockImplementation()
        .mockImplementation(() => true);
    });

    it('should return if port with given name is empty', () => {
      expect(instance._onDisconnect('devtools')).toBeUndefined();
    });

    it('should remove optional listeners', () => {
      instance._onDisconnect('popup', () => {});

      expect(
        instance.ports.popup.onMessage.removeListener.mock.calls
      ).toHaveLength(1);
    });

    it('should not disconnect port if it still has some listeners remaining', () => {
      instance._onDisconnect('popup');

      expect(instance.ports.popup).not.toBeNull();
      expect(
        instance.ports.popup.onMessage.hasListeners.mock.calls
      ).toHaveLength(1);
    });

    it('should disconnect port if it has no remaining listeners registered', () => {
      let disconnectCalled, hasListenersCalled;
      instance.ports.popup.onMessage.hasListeners = () => {
        hasListenersCalled = true;
      };
      instance.ports.popup.disconnect = () => {
        disconnectCalled = true;
      };

      instance._onDisconnect('popup');

      expect(hasListenersCalled).toBe(true);
      expect(disconnectCalled).toBe(true);
      expect(instance.ports.popup).toBeNull();
    });

    it('should clear cache if no other ports are opened', () => {
      instance.cache = [1, 2, 3, 4];
      instance.ports.popup.onMessage.hasListeners = () => false;
      vi.spyOn(instance, 'isEmpty')
        .mockImplementation()
        .mockImplementation(() => true);

      expect(instance.cache).toHaveLength(4);
      instance._onDisconnect('popup');

      expect(instance.ports.popup).toBeNull();
      expect(instance.isEmpty.mock.calls).toHaveLength(1);
      expect(instance.cache).toHaveLength(0);
    });

    it('should execute empty listener with tabId if no other ports are opened', () => {
      instance.ports.popup.onMessage.hasListeners = () => false;
      vi.spyOn(instance, 'isEmpty')
        .mockImplementation()
        .mockImplementation(() => true);

      instance._emptyListener = vi.fn();
      instance._onDisconnect('popup');

      expect(instance.ports.popup).toBeNull();
      expect(instance.isEmpty.mock.calls).toHaveLength(1);
      expect(instance._emptyListener.mock.calls).toHaveLength(1);
      expect(instance._emptyListener.mock.calls[0][0]).toBe(instance.tabId);
    });
  });

  // FIXME memory leak
  // describe('_settingsCallback', () => {
  //   beforeEach(() => {
  //     instance._settingsListener = vi.fn();
  //   });

  //   it('should not do anything if action is not settings action', () => {
  //     instance._settingsCallback({
  //       action: Actions.POPUP,
  //       payload: { enabled: true },
  //     });

  //     expect(instance._settingsListener.mock.calls).toHaveLength(0);
  //   });

  //   it('should call settings listener with enabled value', () => {
  //     instance._settingsCallback({
  //       action: Actions.SETTINGS,
  //       payload: { enabled: true },
  //     });

  //     expect(instance._settingsListener.mock.calls).toHaveLength(1);
  //     expect(instance._settingsListener.mock.calls[0][0]).toBe(true);
  //   });
  // });

  // describe('_aliveCallback', () => {
  //   beforeEach(() => {
  //     instance = new TabConnection(tabId);
  //     vi.spyOn(instance, '_reviveDevtools').mockImplementation();
  //     vi.spyOn(instance, '_notifyPopup').mockImplementation();
  //     instance.ports.popup = mockPort('popup');
  //     instance.ports.devtools = mockPort('devtools');
  //     instance.ports.contentScript = mockPort('contentScript');
  //     utils.setIcon.mockReset();
  //   });

  //   it('should save state on action detecting', () => {
  //     expect(instance.state).toBe(State.RELOAD);

  //     instance._aliveCallback({
  //       action: Actions.DETECTING,
  //       payload: { version: 0 },
  //     });

  //     expect(instance.state).toBe(State.DETECTING);
  //   });

  //   it('should save state on action dead', () => {
  //     expect(instance.state).toBe(State.RELOAD);

  //     instance._aliveCallback({
  //       action: Actions.DEAD,
  //       payload: { version: 0 },
  //     });

  //     expect(instance.state).toBe(State.DEAD);
  //   });

  //   it('should save state on action alive and set payload to appData', () => {
  //     expect(instance.state).toBe(State.RELOAD);

  //     instance._aliveCallback({
  //       action: Actions.ALIVE,
  //       payload: { version: 0 },
  //     });

  //     expect(instance.state).toBe(State.ALIVE);
  //     expect(instance.appData).toStrictEqual({ version: 0 });
  //   });

  //   it('should set alive icon on current tab on alive', () => {
  //     instance._aliveCallback({
  //       action: Actions.ALIVE,
  //       payload: { version: 0 },
  //     });

  //     expect(utils.setIcon.mock.calls).toHaveLength(1);
  //     expect(utils.setIcon.mock.calls[0][0]).toBe(State.ALIVE);
  //     expect(utils.setIcon.mock.calls[0][1]).toBe(instance.tabId);
  //   });

  //   it("should revive devtools if it's registered", () => {
  //     instance._aliveCallback({
  //       action: Actions.ALIVE,
  //       payload: { version: 0 },
  //     });

  //     expect(instance._reviveDevtools.mock.calls).toHaveLength(1);
  //   });

  //   it("should revive not devtools if it's not registered", () => {
  //     instance.ports.devtools = null;
  //     instance._aliveCallback({
  //       action: Actions.ALIVE,
  //       payload: { version: 0 },
  //     });

  //     expect(instance._reviveDevtools.mock.calls).toHaveLength(0);
  //   });

  //   it("should not notify popup if it's not registered", () => {
  //     instance.ports.popup = null;
  //     instance._aliveCallback({
  //       action: Actions.ALIVE,
  //       payload: { version: 0 },
  //     });

  //     expect(instance._notifyPopup.mock.calls).toHaveLength(0);
  //   });

  //   it("should notify popup if it's is registered", () => {
  //     instance._aliveCallback({
  //       action: Actions.ALIVE,
  //       payload: { version: 0 },
  //     });

  //     expect(instance._notifyPopup.mock.calls).toHaveLength(1);
  //   });

  //   it('should remove _aliveCallback on content script on alive and dead states', () => {
  //     instance._aliveCallback({ action: Actions.ALIVE });
  //     expect(
  //       instance.ports.contentScript.onMessage.removeListener.mock.calls
  //     ).toHaveLength(1);

  //     instance._aliveCallback({ action: Actions.ALIVE });
  //     expect(
  //       instance.ports.contentScript.onMessage.removeListener.mock.calls
  //     ).toHaveLength(2);

  //     instance._aliveCallback({ action: Actions.DETECTING });
  //     expect(
  //       instance.ports.contentScript.onMessage.removeListener.mock.calls
  //     ).toHaveLength(2);

  //     instance.state = State.RELOAD;
  //     instance._aliveCallback({ action: Actions.SETTINGS });
  //     expect(
  //       instance.ports.contentScript.onMessage.removeListener.mock.calls
  //     ).toHaveLength(2);
  //   });
  // });

  describe('_cacheMessagesCallback', () => {
    beforeEach(() => {
      instance = new TabConnection(tabId);
    });

    it('should add message to cache', () => {
      instance._cacheMessagesCallback(1);

      expect(instance.cache).toStrictEqual([1]);
    });

    it('should not exceed max cache size', () => {
      for (let i = 0; i < CACHE_SIZE + 100; i++) {
        instance._cacheMessagesCallback(1);
      }

      expect(instance.cache).toHaveLength(CACHE_SIZE);
    });
  });
});
