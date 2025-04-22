import * as helpers from '..';

describe('helper', () => {
  describe('assignRecursively', () => {
    it('should recursively assign all sources to the target', () => {
      let target = { a: 1, b: { c: 2 } };
      helpers.assignRecursively(
        target,
        { a: 3, d: 4 },
        { b: { c: 5 } },
        { b: { d: [5] } }
      );
      expect(target).toStrictEqual({ a: 3, b: { c: 5, d: [5] }, d: 4 });
    });

    it('should clone array to the target object', () => {
      const arrayWithObject = [{ x: 1 }];
      let target = {};
      helpers.assignRecursively(target, { a: arrayWithObject, d: 4 });

      expect(target).toStrictEqual({ a: arrayWithObject, d: 4 });
      expect(arrayWithObject[0]).not.toBe(target.a[0]);
    });

    it('should not merge object protected fields', () => {
      let target = {};
      helpers.assignRecursively(target, {
        a: 1,
        __proto__: { b: 2 },
        prototype: { c: 3 },
        constructor: function () {},
      });

      expect(target).toStrictEqual({ a: 1 });
    });

    it('should use assignTransformation callback to append values', () => {
      const target = {
        a: ['1'],
      };

      const source = {
        a: helpers.assignTransformation(value => [...value, '2', 3, { b: 4 }]),
      };

      helpers.assignRecursively(target, source);

      expect(target).toStrictEqual({
        a: ['1', '2', 3, { b: 4 }],
      });
    });
  });

  describe('assignRecursivelyWithTracking', () => {
    it('should recursively assign all sources to the target and create __meta__ property', () => {
      let target = { a: 1 };

      helpers.assignRecursivelyWithTracking('ref-1')(
        target,
        { b: 3 },
        { c: { d: 5 } },
        { c: { e: [5] } }
      );

      expect(target).toStrictEqual({
        a: 1,
        b: 3,
        c: { d: 5, e: [5] },
        __meta__: { b: 'ref-1', c: 'ref-1', 'c.d': 'ref-1', 'c.e': 'ref-1' },
      });
    });

    it('should override referrers in __meta__ property', () => {
      let target = {
        a: 1,
        b: 3,
        c: { d: 5, e: [5] },
        __meta__: { b: 'ref-1', c: 'ref-1', 'c.d': 'ref-1', 'c.e': 'ref-1' },
      };

      helpers.assignRecursivelyWithTracking('ref-2')(target, { c: { e: 6 } });

      expect(target).toStrictEqual({
        a: 1,
        b: 3,
        c: { d: 5, e: 6 },
        __meta__: { b: 'ref-1', c: 'ref-2', 'c.d': 'ref-1', 'c.e': 'ref-2' },
      });
    });
  });

  describe('deepFreeze', () => {
    it('should deeply freeze any object', () => {
      'use strict'; // throw TypeError when manipulating a frozen object

      let data = {
        a: {
          b: [
            {
              c: 1,
            },
          ],
        },
      };
      helpers.deepFreeze(data);

      expect(() => (data.a = null)).toThrow();
      expect(() => (data.a.b = null)).toThrow();
      expect(() => (data.a.b[0] = null)).toThrow();
      expect(() => (data.a.b[0].c = null)).toThrow();
    });
  });

  describe('resolveEnvironmentSetting', () => {
    const settings = {
      prod: {
        string: 'something',
        deep: {
          number: 1,
        },
      },
      dev: {
        deep: {
          number: 2,
        },
      },
    };

    it('should return production setting', () => {
      let currentSetting = helpers.resolveEnvironmentSetting(settings, 'prod');

      expect(currentSetting.string).toBe(settings.prod.string);
      expect(currentSetting.deep.number).toBe(settings.prod.deep.number);
    });

    it('should return development setting', () => {
      let currentSetting = helpers.resolveEnvironmentSetting(settings, 'dev');

      expect(currentSetting.string).toBe(settings.prod.string);
      expect(currentSetting.deep.number).toBe(settings.dev.deep.number);
    });

    it('should return empty setting', () => {
      let currentSetting = helpers.resolveEnvironmentSetting();

      expect(currentSetting).toStrictEqual({});
    });
  });

  describe('allPromiseHash', () => {
    it('should create a promise wrapping a "hash" object of promises', async () => {
      let source = {
        a: 1,
        b: Promise.resolve(2),
        c: new Promise(resolve => setTimeout(() => resolve(3), 10)),
      };

      const results = await helpers.allPromiseHash(source);

      expect(results).toStrictEqual({
        a: 1,
        b: 2,
        c: 3,
      });
    });
  });

  describe('escapeRegExp', () => {
    it('should escape regexp control characters', () => {
      let escaped = helpers.escapeRegExp('.*+?^=!:${}()|[]/\\]');
      expect(escaped).toBe(
        '\\.\\*\\+\\?\\^\\=\\!\\:\\$\\{\\}\\(\\)\\|\\[\\]\\/\\\\\\]'
      );
    });
  });

  describe('clone', () => {
    it('should clone data', () => {
      let source = {
        a: {
          b: 1,
        },
      };

      expect(helpers.clone(source)).not.toBe(source);
      expect(helpers.clone(source).a).not.toBe(source.a);
      expect(helpers.clone(source)).toStrictEqual(source);
    });
  });
});
