import fs from 'fs';

import { parseLanguageFiles } from '../languages';

describe('parseLanguageFiles', () => {
  const headerPath = '/abs/Header/locale/buttonsEN.json';
  const footerPath = '/abs/Footer/locale/buttonsEN.json';
  const outputPath = '/abs/out.module.js';

  beforeEach(() => {
    jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('merges files sharing the same dictionary key even with adversarial scheduling', async () => {
    // Force the first-scheduled read to resolve last - the classic race trigger.
    jest.spyOn(fs.promises, 'readFile').mockImplementation(((p: string) => {
      const isHeader = String(p) === headerPath;
      const payload = isHeader
        ? Buffer.from(JSON.stringify({ save: 'Save', common: { yes: 'Yes' } }))
        : Buffer.from(
            JSON.stringify({ cancel: 'Cancel', common: { no: 'No' } })
          );

      return new Promise(resolve => {
        setTimeout(() => resolve(payload), isHeader ? 20 : 0);
      });
    }) as never);

    const messages: Record<string, any> = {};
    await parseLanguageFiles(
      messages,
      'en',
      [headerPath, footerPath],
      outputPath
    );

    expect(messages.buttons).toEqual({
      save: 'Save',
      cancel: 'Cancel',
      common: { yes: 'Yes', no: 'No' },
    });
  });

  it('preserves pre-existing keys in messages when merging file contents', async () => {
    jest.spyOn(fs.promises, 'readFile').mockImplementation(((p: string) => {
      const isHeader = String(p) === headerPath;
      const payload = isHeader
        ? Buffer.from(JSON.stringify({ save: 'Save' }))
        : Buffer.from(JSON.stringify({ cancel: 'Cancel' }));

      return Promise.resolve(payload);
    }) as never);

    const messages: Record<string, any> = {
      buttons: { existing: 'value' },
    };
    await parseLanguageFiles(
      messages,
      'en',
      [headerPath, footerPath],
      outputPath
    );

    expect(messages.buttons).toEqual({
      existing: 'value',
      save: 'Save',
      cancel: 'Cancel',
    });
  });

  it('accepts a single string path argument', async () => {
    jest
      .spyOn(fs.promises, 'readFile')
      .mockResolvedValue(
        Buffer.from(JSON.stringify({ save: 'Save' })) as never
      );

    const messages: Record<string, any> = {};
    await parseLanguageFiles(messages, 'en', headerPath, outputPath);

    expect(messages.buttons).toEqual({ save: 'Save' });
  });

  it('wraps read errors with the failing language file path', async () => {
    jest
      .spyOn(fs.promises, 'readFile')
      .mockRejectedValue(new Error('boom') as never);

    const messages: Record<string, any> = {};

    await expect(
      parseLanguageFiles(messages, 'en', [headerPath], outputPath)
    ).rejects.toThrow(/buttonsEN\.json[\s\S]*boom/);
  });
});
