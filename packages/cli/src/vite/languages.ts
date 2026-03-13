import fs from 'fs';
import path from 'path';

import { StringStructure } from '@messageformat/core/lib/compile-module';

const TMP_BASEPATH = './build/tmp';

/**
 * Parses dictionary key from given filename and locale identifier.
 *
 * @param locale Currently processed locale identifier.
 * @param languagePath Path to currently processed JSON language file.
 * @returns Parsed dictionary key.
 */
export function getDictionaryKeyFromFileName(
  locale: string,
  languagePath: string
) {
  return path.parse(languagePath).name.replace(locale.toUpperCase(), '');
}

/**
 * Generates TypeScript declaration file for the compiled dictionary messages
 * so that `Dictionary.get()` calls are type-checked.
 *
 * @param rootDir Current compilation root directory.
 * @param messages Compiled messages object for type introspection.
 */
export async function generateTypeDeclarations(
  rootDir: string,
  messages: StringStructure
) {
  const dictionaryMap = new Map<string, string>();
  const dictionaryTypesPath = path.join(
    rootDir,
    TMP_BASEPATH,
    '/types/dictionary.ts'
  );

  (function recurseMessages(messages: StringStructure | string, path = '') {
    if (typeof messages === 'object') {
      Object.keys(messages).forEach(key => {
        recurseMessages(messages[key], `${path ? path + '.' : path}${key}`);
      });
    } else {
      dictionaryMap.set(path, messages);
    }
  })(messages);

  const content = `declare module '@ima/core' {
  interface DictionaryMap {
    ${Array.from(dictionaryMap.keys())
      .map(key => `'${key}': string;`)
      .join('\n\t\t')}
  }
}

export { };
`;

  if (!fs.existsSync(path.dirname(dictionaryTypesPath))) {
    await fs.promises.mkdir(path.dirname(dictionaryTypesPath), {
      recursive: true,
    });
  }

  await fs.promises.writeFile(
    path.join(rootDir, TMP_BASEPATH, '/types/dictionary.ts'),
    content
  );
}
