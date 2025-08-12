import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { WeakMapStorage } from '../WeakMapStorage';

describe('ima.storage.WeakMapStorage', () => {
  let map: WeakMapStorage;

  beforeEach(() => {
    map = new WeakMapStorage({
      entryTtl: 100,
    });
    Date.now = () => 1000;
    map.set('a', { num: 1 });
  });

  afterEach(() => {
    map.clear();
  });

  it('should reject primitive values', () => {
    expect(() => {
      // @ts-expect-error check throw
      map.set('b', 'some string');
    }).toThrow();
  });

  it('should allow retrieving existing entries', () => {
    expect(map.get('a')).toStrictEqual({ num: 1 });
  });

  it('should return undefined for non-existing entries', () => {
    expect(map.get('something')).toBeUndefined();
  });

  it('should allow storing new values', () => {
    map.set('foo', { string: 'bar' });

    expect(map.get('foo')).toStrictEqual({ string: 'bar' });
  });

  it('should allow over-writing existing values', () => {
    map.set('a', { num2: 42 });

    expect(map.get('a')).toStrictEqual({ num2: 42 });
  });

  it('should allow deleting existing values', () => {
    map.delete('a');

    expect(map.get('a')).toBeUndefined();
  });

  it('should allow clearing itself of all entries', () => {
    map.clear();

    expect(map.get('a')).toBeUndefined();
  });

  it('should discard expired entries', () => {
    expect(map.size()).toBe(1);

    Date.now = () => 1101;

    expect(map.size()).toBe(0);
  });
});
