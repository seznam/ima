/* eslint-disable @typescript-eslint/ban-ts-comment */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClientWindow } from '../../window/ClientWindow';
import { SessionStorage } from '../SessionStorage';

describe('ima.storage.SessionStorage', () => {
  let session: SessionStorage<unknown>;
  let window: ClientWindow;
  const sessionStorage = {
    _storage: new Map(),
    setItem: (key: string, value: unknown) =>
      sessionStorage._storage.set(key, value),
    getItem: (key: string) => sessionStorage._storage.get(key),
    removeItem: (key: string) => sessionStorage._storage.delete(key),
    clear: () => sessionStorage._storage.clear(),
    get length() {
      return sessionStorage._storage.size;
    },
    key: (index: number) => {
      const allKeys: string[] = [];

      for (const key of sessionStorage._storage.keys()) {
        allKeys.push(key);
      }

      return allKeys[index];
    },
  };

  beforeEach(() => {
    window = new ClientWindow();

    // @ts-ignore
    vi.spyOn(window, 'getWindow').mockReturnValue({ sessionStorage });

    session = new SessionStorage(window);

    session.init();
    session.clear();
  });

  afterEach(() => {
    session.clear();
  });

  it('should set and get items', () => {
    session.set('item1', 1);
    expect(session.get('item1')).toBe(1);

    session.set('item2', 'test');
    expect(session.get('item2')).toBe('test');

    session.set('item3', false);
    expect(session.get('item3')).toBeFalsy();

    const obj = { testedProp: 'testedValue' };
    session.set('item4', obj);
    expect(session.get('item4')).toStrictEqual(obj);

    const arr = [0, 'val', true, {}];
    session.set('item5', arr);
    expect(session.get('item5')).toStrictEqual(arr);
  });

  it('should should have (not) an item', () => {
    expect(session.has('item1')).toBeFalsy();
    session.set('item1', 1);
    expect(session.has('item1')).toBeTruthy();
  });

  it('should clear all items', () => {
    session.set('item1', 1).set('item2', 'test').set('item3', false).clear();

    expect(session.has('item1')).toBeFalsy();
    expect(session.has('item2')).toBeFalsy();
    expect(session.has('item3')).toBeFalsy();
  });

  it('should delete selected items only', () => {
    session
      .set('item1', 1)
      .set('item2', 'test')
      .set('item3', false)
      .delete('item1')
      .delete('item3');

    expect(session.has('item1')).toBeFalsy();
    expect(session.has('item2')).toBeTruthy();
    expect(session.has('item3')).toBeFalsy();
  });

  it('should return correct iterator', () => {
    session.set('item1', 1).set('item2', 'test').set('item3', false);

    let index = 0;
    // @ts-expect error

    for (const item of session.keys()) {
      switch (index++) {
        case 0:
          expect(item).toBe('item1');
          break;
        case 1:
          expect(item).toBe('item2');
          break;
        default:
          expect(item).toBe('item3');
          break;
      }
    }

    expect(index).toBe(3);
  });
});
