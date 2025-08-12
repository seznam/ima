import { describe, expect, it } from 'vitest';

import { createEntry } from '../stream';

describe('createEntry', () => {
  const data = {
    action: 'action',
    sentinel: 'dev:to:web',
    payload: { now: new Date().getMilliseconds() },
  };

  it('should return passed data if input is JSON serializable', () => {
    const result = createEntry(data);
    expect(result).toStrictEqual(data);
  });

  it('should return error message if the input is not JSON serializable', () => {
    globalThis.JSON.stringify = () => '{"foo":bar"}';
    const result = createEntry(data);

    // Stringify here is used to catch the error correctly
    expect(JSON.stringify(result)).toBe(
      JSON.stringify({
        sentinel: data.sentinel,
        action: 'error',
        payload: {},
        error: '[SyntaxError: Unexpected token b in JSON at position 7]',
      })
    );
  });
});
