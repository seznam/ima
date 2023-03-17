import { ClientWindow } from '../ClientWindow';
import { CaptureOptions } from '../Window';

class TestEventTarget {
  event?: string;
  listener?: (event: Event) => void;
  useCapture?: boolean | CaptureOptions;

  addEventListener(
    event: string,
    listener: (event: Event) => void,
    useCapture?: boolean | CaptureOptions
  ) {
    this.event = event;
    this.listener = listener;
    this.useCapture = useCapture;
  }

  removeEventListener(
    event: string,
    listener: (event: Event) => void,
    useCapture?: boolean | CaptureOptions
  ) {
    if (
      event === this.event &&
      listener === this.listener &&
      useCapture === this.useCapture
    ) {
      this.clear();
    }
  }

  clear() {
    this.event = undefined;
    this.listener = undefined;
    this.useCapture = undefined;
  }
}

const event = 'event';
const listener = () => {
  return;
};
const useCapture = false;
const scope = {};

describe('ima.window.ClientWindow', () => {
  let eventTarget: TestEventTarget;
  let clientWindow: ClientWindow;

  beforeEach(() => {
    eventTarget = new TestEventTarget();
    clientWindow = new ClientWindow();
  });

  it('should bind scoped event listener', () => {
    eventTarget.clear();
    clientWindow.bindEventListener(
      eventTarget as unknown as EventTarget,
      event,
      listener,
      useCapture,
      scope
    );

    expect(
      clientWindow._findScopedListener(
        eventTarget as unknown as EventTarget,
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
      eventTarget as unknown as EventTarget,
      event,
      listener,
      useCapture,
      scope
    );

    expect(
      clientWindow._findScopedListener(
        eventTarget as unknown as EventTarget,
        event,
        listener,
        useCapture,
        scope
      )
    ).toEqual(eventTarget.listener);

    clientWindow.unbindEventListener(
      eventTarget as unknown as EventTarget,
      event,
      listener,
      useCapture,
      scope
    );

    expect(
      clientWindow._findScopedListener(
        eventTarget as unknown as EventTarget,
        event,
        listener,
        useCapture,
        scope
      )
    ).toBeUndefined();
  });
});
