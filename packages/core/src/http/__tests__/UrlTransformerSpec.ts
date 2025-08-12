import { beforeEach, describe, expect, it } from 'vitest';

import { UrlTransformer } from '../UrlTransformer';

describe('ima.core.http.UrlTransformer', () => {
  let transformer: UrlTransformer;

  beforeEach(() => {
    transformer = new UrlTransformer();

    transformer
      .addRule('//localhost:3001/something', '//127.0.0.1:3002/somethingElse')
      .addRule(':appIdRules', '123');
  });

  it('should add next rule', () => {
    transformer.addRule('aaa', 'bbb');

    expect(Object.keys(transformer['_rules'])).toHaveLength(3);
  });

  it('should clear rules', () => {
    transformer.clear();

    expect(Object.keys(transformer['_rules'])).toHaveLength(0);
  });

  it('should apply one rule', () => {
    expect(
      transformer.transform('http://localhost:3001/something/otherPath')
    ).toBe('http://127.0.0.1:3002/somethingElse/otherPath');
  });

  it('should apply both rules', () => {
    expect(
      transformer.transform(
        'http://localhost:3001/something/otherPath/:appIdRules'
      )
    ).toBe('http://127.0.0.1:3002/somethingElse/otherPath/123');
  });

  it('should return same url for not match rules', () => {
    const url = 'http://www.example.com/something';

    expect(transformer.transform(url)).toBe(url);
  });

  it('should return same url for none rules', () => {
    const url = 'http://www.example.com/something';
    transformer = new UrlTransformer();

    expect(transformer.transform(url)).toBe(url);
  });
});
