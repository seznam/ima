/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { RouterEvents } from '../../router/RouterEvents';
import { DispatcherImpl } from '../DispatcherImpl';
import { ObservableImpl } from '../ObservableImpl';

describe('ima.core.event.Observable', () => {
  const dispatcher = new DispatcherImpl();
  const observable = new ObservableImpl(dispatcher);
  const event = 'dispatcher.event';
  const eventData = { foo: 'bar' };

  beforeEach(() => {
    dispatcher.clear();
    observable.clear();
  });

  describe('init method', () => {
    it('should listen to all dispatcher events', () => {
      expect(dispatcher['_eventListenersAll'].size).toBe(0);

      observable.init();

      expect(dispatcher['_eventListenersAll'].size).toBe(1);
    });
  });

  describe('subscribe method', () => {
    it('should subscribe to event', () => {
      expect(observable['_observers'].size).toBe(0);

      const observer = jest.fn();
      observable.subscribe(event, observer);

      expect(observable['_observers'].size).toBe(1);

      dispatcher.fire(event, eventData);

      expect(observer).toHaveBeenCalledWith(eventData);
    });

    it('should subscribe to event and get data if already fired', () => {
      dispatcher.fire(event, eventData);
      const observer = jest.fn();
      observable.subscribe(event, observer);

      expect(observer).toHaveBeenCalledWith(eventData);

      dispatcher.fire(event, { 1: 2 });

      expect(observer).toHaveBeenCalledWith({ 1: 2 });
    });

    it('should subscribe to event and get data if already fired multiple times', () => {
      dispatcher.fire(event, eventData);
      const observer = jest.fn();
      observable.subscribe(event, observer);

      expect(observer).toHaveBeenCalledWith(eventData);

      dispatcher.fire(event, { 1: 2 });
      dispatcher.fire(event, { 1: 2 });
      dispatcher.fire(event, { 3: 4 });

      expect(observer).toHaveBeenNthCalledWith(2, { 1: 2 });
      expect(observer).toHaveBeenLastCalledWith({ 3: 4 });
    });

    it('should subscribe to event and get data if already mrkev fired multiple times', () => {
      const observable2 = new ObservableImpl(dispatcher, {
        maxHistoryLength: 2,
      });
      observable2.init();

      dispatcher.fire(event, eventData);
      dispatcher.fire(event, { 1: 2 });
      dispatcher.fire(event, { 3: 4 });

      const observer = jest.fn();
      observable2.subscribe(event, observer);

      expect(observer).not.toHaveBeenCalledWith(eventData);
      expect(observer).toHaveBeenCalledWith({ 1: 2 });
      expect(observer).toHaveBeenLastCalledWith({ 3: 4 });
    });

    it('should work with scope', () => {
      class Foo {
        foo = jest.fn();

        bar() {
          this.foo();
        }
      }

      const foo = new Foo();

      observable.subscribe(event, foo.bar);

      expect(() => dispatcher.fire(event, eventData)).toThrow(
        "Cannot read properties of undefined (reading 'foo')"
      );

      observable.unsubscribe(event, foo.bar);
      observable.subscribe(event, foo.bar, foo);

      expect(foo.foo).toHaveBeenCalled();
    });
  });

  describe('unsubscribe method', () => {
    it('should unsubscribe from event', () => {
      const observer = jest.fn();
      observable.subscribe(event, observer);
      dispatcher.fire(event, eventData);

      expect(observer).toHaveBeenCalledWith(eventData);

      observer.mockClear();
      observable.unsubscribe(event, observer);
      dispatcher.fire(event, { foo: 'bar' });

      expect(observer).not.toHaveBeenCalled();
      expect(observable['_observers'].get(event)?.size).toBe(0);
    });
  });

  it('should reset only page events', () => {
    observable.registerPersistenEvent(event);
    dispatcher.fire(event, eventData);
    dispatcher.fire('foo', 'bar');
    dispatcher.fire(RouterEvents.BEFORE_HANDLE_ROUTE, { bhr: true });

    const eventObserver = jest.fn();
    observable.subscribe(event, eventObserver);

    expect(eventObserver).toHaveBeenCalledWith(eventData);

    const bhrObserver = jest.fn();
    observable.subscribe(RouterEvents.BEFORE_HANDLE_ROUTE, bhrObserver);

    expect(bhrObserver).toHaveBeenCalledWith({ bhr: true });

    const fooObserver = jest.fn();
    observable.subscribe('foo', fooObserver);

    expect(fooObserver).not.toHaveBeenCalled();
  });
});
