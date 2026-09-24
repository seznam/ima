import { strict as assert } from 'node:assert';
import {
  clearImmediate as clearImmediateFallback,
  setImmediate as setImmediateFallback,
} from 'node:timers';

import type { Window } from '@ima/core';

import { trackWindowEventListeners } from './events';

interface EnvironmentNatives {
  setInterval: typeof setInterval;
  setTimeout: typeof setTimeout;
  setImmediate: typeof setImmediate;
  clearImmediate: typeof clearImmediate;
  debug: typeof $Debug;
  consoleAssert?: typeof console.assert;
  windowScrollTo?: typeof window.scrollTo;
  windowRequestAnimationFrame?: typeof window.requestAnimationFrame;
}

// Captured when the shims are installed so Jest fake timers installed by the test
// are wrapped instead of being replaced by the real implementations.
let environmentNatives: EnvironmentNatives | undefined;
let pendingTimerCleanups: Array<() => void> = [];
let clearWindowEventListeners: (() => void) | undefined;

/**
 * Wraps a scheduling function so its pending callbacks can be cancelled on cleanup.
 */
function trackTimer<A extends unknown[], H>(
  schedule: (...args: A) => H,
  cancel: (handle: H) => void
): (...args: A) => H {
  const trackedSchedule = (...args: A): H => {
    const handle = schedule(...args);
    pendingTimerCleanups.push(() => cancel(handle));

    return handle;
  };

  // Keeps Jest fake timer markers (clock, _isMockFunction) visible to Testing Library.
  return Object.defineProperties(
    trackedSchedule,
    Object.getOwnPropertyDescriptors(schedule)
  );
}

/**
 * Overrides the globals an IMA application relies on but jsdom does not provide,
 * and wraps the scheduling globals so pending work can be cleared on cleanup.
 */
export function installIntegrationEnvironment(): void {
  const setIntervalNative = global.setInterval;
  const setTimeoutNative = global.setTimeout;
  const setImmediateNative = global.setImmediate;
  const clearImmediateNative = global.clearImmediate;
  const requestAnimationFrameNative = window.requestAnimationFrame;
  const cancelAnimationFrameNative = window.cancelAnimationFrame;

  environmentNatives = {
    setInterval: setIntervalNative,
    setTimeout: setTimeoutNative,
    setImmediate: setImmediateNative,
    clearImmediate: clearImmediateNative,
    debug: globalThis.$Debug,
    consoleAssert: global.console?.assert,
    windowScrollTo: window.scrollTo,
    windowRequestAnimationFrame: requestAnimationFrameNative,
  };

  // node:assert reports the failing expression, which the XPath selectors rely on.
  global.console.assert = assert;
  window.scrollTo = () => {};

  global.setInterval = trackTimer(setIntervalNative, handle =>
    global.clearInterval(handle)
  ) as typeof setInterval;
  global.setTimeout = trackTimer(setTimeoutNative, handle =>
    global.clearTimeout(handle)
  ) as typeof setTimeout;
  global.clearImmediate = clearImmediateNative ?? clearImmediateFallback;
  global.setImmediate = trackTimer(
    setImmediateNative ?? setImmediateFallback,
    handle => (clearImmediateNative ?? clearImmediateFallback)(handle)
  ) as typeof setImmediate;

  // PageNavigationHandler scrolls through a double animation frame, which would
  // otherwise call the restored jsdom window.scrollTo after the test finished.
  if (typeof requestAnimationFrameNative === 'function') {
    window.requestAnimationFrame = trackTimer(
      (callback: FrameRequestCallback) =>
        requestAnimationFrameNative.call(window, callback),
      handle => cancelAnimationFrameNative?.call(window, handle)
    );
  }
}

/**
 * Restores the globals replaced by installIntegrationEnvironment and cancels the
 * callbacks and listeners left behind by the application.
 */
export function restoreIntegrationEnvironment(): void {
  if (environmentNatives) {
    global.setInterval = environmentNatives.setInterval;
    global.setTimeout = environmentNatives.setTimeout;
    global.setImmediate = environmentNatives.setImmediate;
    global.clearImmediate = environmentNatives.clearImmediate;
    globalThis.$Debug = environmentNatives.debug;

    if (global.console && environmentNatives.consoleAssert) {
      global.console.assert = environmentNatives.consoleAssert;
    }

    if (environmentNatives.windowScrollTo) {
      window.scrollTo = environmentNatives.windowScrollTo;
    }

    if (environmentNatives.windowRequestAnimationFrame) {
      window.requestAnimationFrame =
        environmentNatives.windowRequestAnimationFrame;
    }

    environmentNatives = undefined;
  }

  pendingTimerCleanups.forEach(clear => clear());
  pendingTimerCleanups = [];
  clearWindowEventListeners?.();
  clearWindowEventListeners = undefined;
}

export function isIntegrationEnvironmentInstalled(): boolean {
  return environmentNatives !== undefined;
}

/**
 * Removes the listeners bound through the application's $Window on cleanup.
 */
export function trackApplicationWindow(imaWindow: Window): void {
  clearWindowEventListeners = trackWindowEventListeners(imaWindow);
}
