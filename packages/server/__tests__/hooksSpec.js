const { emit, on, off, once, Event, onError, Emitter } = require('../hooks');

describe('Emitter', () => {
  let emitter = null;
  const MyEvent = 'myEvent';
  const data = {};

  beforeEach(() => {
    emitter = new Emitter();
  });

  it('should add and remove listener for defined event', () => {
    const off = emitter.on(MyEvent, () => {});

    expect(emitter.listeners(MyEvent)).toHaveLength(1);
    off();
    expect(emitter.listeners(MyEvent)).toHaveLength(0);
  });

  it('should add and remove listener with off method for defined event', () => {
    const listener = () => {};

    emitter.on(MyEvent, listener);

    expect(emitter.listeners(MyEvent)).toHaveLength(1);

    emitter.off(MyEvent, listener);
    expect(emitter.listeners(MyEvent)).toHaveLength(0);
  });

  it('should emit event on defined listeners', async () => {
    const listener = jest.fn(({ $result }) => {
      return ($result ?? 0) + 1;
    });

    emitter.on(MyEvent, listener);
    emitter.on(MyEvent, listener);

    const event = emitter.emit(MyEvent, data);

    expect(event).toMatchInlineSnapshot(`
      Object {
        "$__stopped__": false,
        "$error": null,
        "$name": "myEvent",
        "$result": 2,
        "$stopPropagation": [Function],
      }
    `);
    expect(listener).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            Object {
              "$__stopped__": false,
              "$error": null,
              "$name": "myEvent",
              "$result": 2,
              "$stopPropagation": [Function],
            },
          ],
          Array [
            Object {
              "$__stopped__": false,
              "$error": null,
              "$name": "myEvent",
              "$result": 2,
              "$stopPropagation": [Function],
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": 1,
          },
          Object {
            "type": "return",
            "value": 2,
          },
        ],
      }
    `);
  });

  it('should emit event on defined listeners', async () => {
    const listener = jest.fn(({ $result }) => {
      return $result !== undefined
        ? Promise.resolve($result + 1)
        : Promise.resolve(0);
    });
    emitter.on(MyEvent, listener);
    emitter.on(MyEvent, listener);

    const event = await emitter.emit(MyEvent, data);

    expect(event).toMatchInlineSnapshot(`
      Object {
        "$__stopped__": false,
        "$error": null,
        "$name": "myEvent",
        "$result": 1,
        "$stopPropagation": [Function],
      }
    `);
    expect(listener).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            Object {
              "$__stopped__": false,
              "$error": null,
              "$name": "myEvent",
              "$result": 1,
              "$stopPropagation": [Function],
            },
          ],
          Array [
            Object {
              "$__stopped__": false,
              "$error": null,
              "$name": "myEvent",
              "$result": 1,
              "$stopPropagation": [Function],
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": Promise {},
          },
          Object {
            "type": "return",
            "value": Promise {},
          },
        ],
      }
    `);
  });

  it('should allow stopPropagation event for sync mode to other listeners', async () => {
    const listener = jest.fn(({ stopPropagation }) => stopPropagation());

    emitter.on(MyEvent, listener);
    emitter.on(MyEvent, listener);

    await emitter.emit(MyEvent, data);

    expect(listener.mock.calls.length).toEqual(1);
  });

  it('should allow stopPropagation event for async to other listeners', async () => {
    const listener = jest.fn(({ stopPropagation }) => {
      return new Promise(resolve => {
        stopPropagation();
        resolve();
      });
    });

    emitter.on(MyEvent, listener);
    emitter.on(MyEvent, listener);

    await emitter.emit(MyEvent, data);

    expect(listener.mock.calls.length).toEqual(1);
  });

  it('should emit Error event for sync mode after throwing Error', async () => {
    const listener = jest.fn();
    const throwListener = () => {
      throw new Error('Some');
    };
    const errorListener = jest.fn();

    emitter.on(MyEvent, listener);
    emitter.on(MyEvent, throwListener);
    emitter.on(MyEvent, listener);
    emitter.on(Event.Error, errorListener);

    await emitter.emit(MyEvent, data);

    expect(listener.mock.calls.length).toEqual(1);
    expect(errorListener.mock.calls.length).toEqual(1);
  });

  it('should emit Error event for async mode after throwing Error', async () => {
    const listener = jest.fn(() => Promise.resolve(1));
    const throwListener = () => {
      throw new Error('Some');
    };
    const errorListener = jest.fn();

    emitter.on(MyEvent, listener);
    emitter.on(MyEvent, throwListener);
    emitter.on(MyEvent, listener);
    emitter.on(Event.Error, errorListener);

    await emitter.emit(MyEvent, data);

    expect(listener.mock.calls.length).toEqual(1);
    expect(errorListener.mock.calls.length).toEqual(1);
  });

  it('should emit event on defined listeners only once', async () => {
    const listener = jest.fn();

    emitter.once(MyEvent, listener);

    await emitter.emit(MyEvent, data);
    await emitter.emit(MyEvent, data);

    expect(listener.mock.calls.length).toEqual(1);
  });

  it('should remove all defined listeners', () => {
    const MyEvent2 = 'MyEvent2';

    emitter.on(MyEvent, jest.fn());
    emitter.on(MyEvent, jest.fn());
    emitter.on(MyEvent, jest.fn());

    emitter.on(MyEvent2, jest.fn());
    emitter.on(MyEvent2, jest.fn());
    emitter.on(MyEvent2, jest.fn());

    emitter.removeAllListeners();

    expect(emitter.listeners(MyEvent).length).toEqual(0);
    expect(emitter.listeners(MyEvent2).length).toEqual(0);
  });
});

describe('hooks', () => {
  it('should has Emitter class', () => {
    expect(typeof Emitter === 'function').toBeTruthy();
  });

  it('should has emit function', () => {
    expect(typeof emit === 'function').toBeTruthy();
  });

  it('should has on function', () => {
    expect(typeof on === 'function').toBeTruthy();
  });

  it('should has off function', () => {
    expect(typeof off === 'function').toBeTruthy();
  });

  it('should has once function', () => {
    expect(typeof once === 'function').toBeTruthy();
  });

  it('should has onError function', () => {
    expect(typeof onError === 'function').toBeTruthy();
  });

  it('should has defined base events', () => {
    expect(Event).toMatchInlineSnapshot(`
      Object {
        "Error": "hooks.error",
      }
    `);
  });
});
