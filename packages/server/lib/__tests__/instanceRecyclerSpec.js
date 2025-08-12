import { beforeEach, describe, expect, it } from 'vitest';

const instanceRecycler = require('../instanceRecycler.js');

describe('instranceRecycler', () => {
  beforeEach(() => {
    instanceRecycler.clear();
  });

  describe('init method', () => {
    it('should throw error for more times initialization', () => {
      instanceRecycler.init(function () {}, 5);

      expect(() => {
        instanceRecycler.init(function () {}, 5);
      }).toThrow();
    });
  });
});
