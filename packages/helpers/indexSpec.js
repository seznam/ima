const helpers = require('./index');

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
      expect(target).toEqual({ a: 3, b: { c: 5, d: [5] }, d: 4 });
    });
  });

  describe('deepFreeze', () => {
    it('should deeply freeze any object', () => {
      'use strict'; // throw TypeError when manipulating a frozen object

      let data = {
        a: {
          b: [
            {
              c: 1
            }
          ]
        }
      };
      helpers.deepFreeze(data);

      expect(() => (data.a = null)).toThrow();
      expect(() => (data.a.b = null)).toThrow();
      expect(() => (data.a.b[0] = null)).toThrow();
      expect(() => (data.a.b[0].c = null)).toThrow();
    });
  });

  describe('debounce', () => {
    it('should delay all calls to a function to a single call', done => {
      let counter = 0;
      function inc() {
        counter++;
      }
      let debouncedInc = helpers.debounce(inc);

      Array.from({ length: 10 }).forEach(debouncedInc);

      setTimeout(() => {
        expect(counter).toBe(1);
        done();
      }, 100); // the default delay
    });
  });

  describe('throttle', () => {
    it('should throttle the calls to a function', done => {
      let counter = 0;
      let scope = {};
      function inc() {
        expect(this).toBe(scope);
        counter++;
      }
      let throttledInc = helpers.throttle(inc, 50, scope);

      Array.from({ length: 10 }).forEach(throttledInc);

      expect(counter).toBe(1);
      setTimeout(() => {
        expect(counter).toBe(1);

        setTimeout(() => {
          expect(counter).toBe(2);
          done();
        }, 55);
      }, 5);
    });
  });

  describe('allPromiseHash', () => {
    it('should create a promise wrapping a "hash" object of promises', done => {
      let source = {
        a: 1,
        b: Promise.resolve(2),
        c: new Promise(resolve => setTimeout(() => resolve(3), 10))
      };
      helpers.allPromiseHash(source).then(results => {
        expect(results).toEqual({
          a: 1,
          b: 2,
          c: 3
        });
        done();
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
          b: 1
        }
      };

      expect(helpers.clone(source)).not.toBe(source);
      expect(helpers.clone(source).a).not.toBe(source.a);
      expect(helpers.clone(source)).toEqual(source);
    });
  });
});
