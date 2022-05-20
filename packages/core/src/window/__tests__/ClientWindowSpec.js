import ClientWindow from '../ClientWindow';

const eventTarget = {
  addEventListener: (event, listener, useCapture) => {
    eventTarget.event = event;
    eventTarget.listener = listener;
    eventTarget.useCapture = useCapture;
  },
  removeEventListener: (event, listener, useCapture) => {
    if (
      event === eventTarget.event &&
      listener === eventTarget.listener &&
      useCapture === eventTarget.useCapture
    ) {
      eventTarget.event = null;
      eventTarget.listener = null;
      eventTarget.useCapture = null;
    }
  },
  clear: () => {
    eventTarget.event = null;
    eventTarget.listener = null;
    eventTarget.useCapture = null;
  },
};
const event = 'event';
const listener = () => {};
const useCapture = false;
const scope = {};

describe('ima.window.ClientWindow', () => {
  let clientWindow = null;

  beforeEach(() => {
    clientWindow = new ClientWindow();
  });

  it('should bind scoped event listener', () => {
    eventTarget.clear();
    clientWindow.bindEventListener(
      eventTarget,
      event,
      listener,
      useCapture,
      scope
    );

    expect(
      clientWindow._findScopedListener(
        eventTarget,
        event,
        listener,
        useCapture,
        scope
      )
    ).toEqual(eventTarget.listener);
  });

  it('should unbind scoped event listener', () => {
    eventTarget.clear();
    clientWindow.bindEventListener(
      eventTarget,
      event,
      listener,
      useCapture,
      scope
    );

    expect(
      clientWindow._findScopedListener(
        eventTarget,
        event,
        listener,
        useCapture,
        scope
      )
    ).toEqual(eventTarget.listener);

    clientWindow.unbindEventListener(
      eventTarget,
      event,
      listener,
      useCapture,
      scope
    );

    expect(
      clientWindow._findScopedListener(
        eventTarget,
        event,
        listener,
        useCapture,
        scope
      )
    ).toBeUndefined();
  });
});
