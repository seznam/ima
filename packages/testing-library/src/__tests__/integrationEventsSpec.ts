/** @jest-environment jsdom */

import { ClientWindow } from '@ima/core';
import { act, render } from '@testing-library/react/pure';
import { createElement } from 'react';

import {
  getImaTestingLibraryClientConfig,
  setImaTestingLibraryClientConfig,
} from '../client/configuration';
import { initImaApp } from '../integration';
import { trackWindowEventListeners } from '../integration/events';

describe('integration React events', () => {
  const clientConfig = getImaTestingLibraryClientConfig();
  const defaultIntegrationConfig = { ...clientConfig.integration };

  afterEach(() => {
    clientConfig.integration = { ...defaultIntegrationConfig };
  });

  it('removes IMA-owned listeners without removing native listeners', () => {
    const imaWindow = new ClientWindow();
    const nativeListener = jest.fn();
    const ownedListener = jest.fn();
    const scope = {};
    const clearListeners = trackWindowEventListeners(imaWindow);

    document.addEventListener('integration-event', nativeListener);
    imaWindow.bindEventListener(
      document,
      'integration-event',
      ownedListener,
      { capture: true },
      scope
    );
    document.dispatchEvent(new Event('integration-event'));

    expect(ownedListener).toHaveBeenCalledTimes(1);
    expect(ownedListener.mock.contexts[0]).toBe(scope);

    clearListeners();
    document.dispatchEvent(new Event('integration-event'));

    expect(ownedListener).toHaveBeenCalledTimes(1);
    expect(nativeListener).toHaveBeenCalledTimes(2);
    expect(imaWindow.bindEventListener).toBe(
      ClientWindow.prototype.bindEventListener
    );
    document.removeEventListener('integration-event', nativeListener);
  });

  it('does not unbind listeners that their owner already removed', () => {
    const imaWindow = new ClientWindow();
    const unbindEventListener = jest.spyOn(imaWindow, 'unbindEventListener');
    const listener = jest.fn();
    const scope = {};
    const clearListeners = trackWindowEventListeners(imaWindow);

    imaWindow.bindEventListener(window, 'resize', listener, true, scope);
    imaWindow.unbindEventListener(
      window,
      'resize',
      listener,
      { capture: true },
      scope
    );
    clearListeners();

    expect(unbindEventListener).toHaveBeenCalledTimes(1);
    unbindEventListener.mockRestore();
  });

  it('preserves React document listeners across failed application boots', async () => {
    const onClick = jest.fn();
    const onSelect = jest.fn();

    setImaTestingLibraryClientConfig({
      integration: {
        prebootScript: () => {
          const result = render(
            createElement('input', {
              defaultValue: 'testing',
              onClick,
              onSelect,
            })
          );
          const input = result.getByRole('textbox') as HTMLInputElement;

          try {
            act(() => {
              input.click();
              input.focus();
              input.setSelectionRange(1, 3);
              document.dispatchEvent(new Event('selectionchange'));
            });
          } finally {
            result.unmount();
            result.container.remove();
          }

          throw new Error('preboot failed');
        },
      },
    });

    await expect(initImaApp()).rejects.toThrow('preboot failed');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);

    await expect(initImaApp()).rejects.toThrow('preboot failed');
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});
