import type { Window } from '@ima/core';

type ListenerArguments = Parameters<Window['bindEventListener']>;

function matchesListener(
  registered: ListenerArguments,
  requested: ListenerArguments
): boolean {
  const getCapture = (options: ListenerArguments[3]) =>
    typeof options === 'boolean' ? options : !!options?.capture;

  return (
    registered[0] === requested[0] &&
    registered[1] === requested[1] &&
    registered[2] === requested[2] &&
    getCapture(registered[3]) === getCapture(requested[3]) &&
    registered[4] === requested[4]
  );
}

export function trackWindowEventListeners(imaWindow: Window): () => void {
  const bindEventListener = imaWindow.bindEventListener;
  const unbindEventListener = imaWindow.unbindEventListener;
  const listeners: ListenerArguments[] = [];

  imaWindow.bindEventListener = (...args: ListenerArguments) => {
    bindEventListener.apply(imaWindow, args);

    if (!listeners.some(registered => matchesListener(registered, args))) {
      listeners.push(args);
    }
  };

  imaWindow.unbindEventListener = (...args: ListenerArguments) => {
    unbindEventListener.apply(imaWindow, args);

    const index = listeners.findIndex(registered =>
      matchesListener(registered, args)
    );

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };

  return () => {
    imaWindow.bindEventListener = bindEventListener;
    imaWindow.unbindEventListener = unbindEventListener;

    for (const args of listeners) {
      unbindEventListener.apply(imaWindow, args);
    }

    listeners.length = 0;
  };
}
