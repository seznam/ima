import * as Helper from '@ima/helpers';
import CacheFactory from '../CacheFactory';
import Cache from '../CacheImpl';
import MapStorage from 'src/storage/MapStorage';

describe('ima.core.cache.CacheImpl', () => {
  let cache = null;
  let cacheStorage = null;
  let cacheFactory = null;

  beforeEach(() => {
    cacheStorage = new MapStorage();
    cacheFactory = new CacheFactory();
    cache = new Cache(cacheStorage, cacheFactory, Helper, {
      enabled: true,
      ttl: 1000,
    });
    Date.now = () => 1000;
    cache.set('aaa', 123);
  });

  it('should store value for key', () => {
    cache.set('bbb', 456);
    cache.set('ccc', 321, 2000);

    Date.now = () => 2001;

    expect(cache.has('aaa')).toBe(false);
    expect(cache.has('bbb')).toBe(false);
    expect(cache.has('ccc')).toBe(true);
  });

  describe('set method', () => {
    it('should store deep clone', () => {
      let object = {
        number: 1,
        boolean: true,
        string: 'text',
        array: [1, 2, 3, [4, 5]],
        object: {
          number: 1,
          boolean: true,
          string: 'text',
          array: [1, 2, 3, [4, 5], { number: 1 }],
        },
      };

      cache.set('object', object);

      object.object.number = 2;
      object.object.array[3] = 4;
      object.object.array[4].number = 2;

      let cacheObject = cache.get('object');

      expect(cacheObject.object.number).toBe(1);
      expect(cacheObject.object.array[3]).toStrictEqual([4, 5]);
      expect(cacheObject.object.array[4].number).toBe(1);
    });

    it('should returns deep clone', () => {
      let object = {
        number: 1,
        boolean: true,
        string: 'text',
        array: [1, 2, 3, [4, 5]],
        object: {
          number: 1,
          boolean: true,
          string: 'text',
          array: [1, 2, 3, [4, 5], { number: 1 }],
        },
      };

      cache.set('object', object);
      let cloneObject = cache.get('object');

      cloneObject.object.number = 2;
      cloneObject.object.array[3] = 4;
      cloneObject.object.array[4].number = 2;

      expect(cache.get('object')).toStrictEqual(object);
    });

    it('should return same value for instance of Promise', () => {
      let promise = Promise.resolve('promise');
      jest.spyOn(Helper, 'clone').mockImplementation();

      cache.set('promise', promise);

      expect(Helper.clone).not.toHaveBeenCalled();
      expect(cache.get('promise')).toStrictEqual(promise);
    });
  });

  it('should return false for undefined cacheEntry', () => {
    jest.spyOn(cacheStorage, 'has').mockReturnValue(true);

    expect(cache.has('bbb')).toBe(false);
  });

  it('should return cached value for exist key', () => {
    expect(cache.get('aaa')).toBe(123);
  });

  it('should return null for not exist key', () => {
    expect(cache.get('bbb')).toBeNull();
  });

  it('should cleared cache', () => {
    cache.clear();

    expect(cache.has('aaa')).toBe(false);
  });

  it('should cache disabled', () => {
    cache.disable();

    expect(cache.has('aaa')).toBe(false);
  });

  it('should serialize and deserialize', () => {
    let serialization = cache.serialize();
    cache.clear();
    cache.deserialize(serialization);

    expect(cache.has('aaa')).toBe(false);
  });

  it('should serialize only instances of the CacheEntry', () => {
    jest
      .spyOn(cacheFactory, 'createCacheEntry')
      .mockReturnValue({ foo: 'bar' });

    cache.set('myKey', {
      foo: 'bar',
    });
    const serialization = cache.serialize();

    expect(serialization).toBe(
      JSON.stringify({
        aaa: {
          value: 123,
          ttl: 1000,
        },
      })
    );
  });

  it('should serialize javascript Infinity value ttl to "Infinity" string ttl', () => {
    cache.clear();
    cache.set('key', 'value', Infinity);
    const serialization = cache.serialize();

    expect(serialization).toBe(
      JSON.stringify({
        key: {
          value: 'value',
          ttl: 'Infinity',
        },
      })
    );
  });

  it('should serialize number value ttl to string', () => {
    cache.clear();
    cache.set('key', 'value', 60000);
    const serialization = cache.serialize();

    expect(serialization).toBe(
      JSON.stringify({
        key: {
          value: 'value',
          ttl: 60000,
        },
      })
    );
  });

  it('should deserialize "Infinity" string value ttl to javascript Infinity value', () => {
    const serialization = {
      key: {
        value: 'value',
        ttl: 'Infinity',
      },
    };
    cache.clear();
    cache.deserialize(serialization);

    expect(cache._cache.get('key')._ttl).toBe(Infinity);
  });

  it('should throw error for serialize if value is instance of Promise', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    cache.set('promise', Promise.resolve('promise'));

    expect(() => {
      cache.serialize();
    }).toThrow();
    expect(console.warn).toHaveBeenCalled();
  });

  describe('_canSerializeValue method', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    it('should return false for Date', () => {
      expect(cache._canSerializeValue(new Date())).toBe(false);
    });

    it('should return false for RegExp', () => {
      expect(cache._canSerializeValue(new RegExp('/'))).toBe(false);
    });

    it('should return false for resolved promise', () => {
      expect(cache._canSerializeValue(Promise.resolve(1))).toBe(false);
    });

    it('should return false for object with bad type of keys', () => {
      let object = {
        date: new Date(),
      };

      expect(cache._canSerializeValue(object)).toBe(false);
    });

    it('should return true for serializable object', () => {
      let object = {
        number: 1,
        string: 'string',
        boolean: true,
        array: [1, 2, 3, { string: 'string' }],
        object: {
          number: 1,
        },
      };

      expect(cache._canSerializeValue(object)).toBe(true);
    });
  });
});
