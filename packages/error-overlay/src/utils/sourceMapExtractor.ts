import { SourceMapConsumer } from 'source-map';

import { SourceMap, SourceStorage } from '#/entities';

/**
 * Extracts sourceMappingURL from the provided file contents.
 *
 * @param {string} fileUri The uri of the source file.
 * @param {string} fileContents Source file file contents.
 * @returns {Promise<string>}
 */
async function extractSourceMappingUrl(
  fileUri: string,
  fileContents: string
): Promise<string> {
  const regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
  let match: RegExpExecArray | null = null;

  for (;;) {
    const next = regex.exec(fileContents);

    if (next == null) {
      break;
    }

    match = next;
  }

  if (!(match && match[1])) {
    return Promise.reject(`Cannot find a source map directive for ${fileUri}.`);
  }

  return Promise.resolve(match[1].toString());
}

/**
 * Original {@link https://github.com/facebook/create-react-app/blob/main/packages/react-error-overlay/src/utils/getSourceMap.js}.
 *
 * Parses source maps for given file. Either inline base64 eval
 * source maps or it fetches external source maps from dev server API.
 *
 * @param {string} fileUri The uri of the source file.
 * @param {string} fileContents Source file file contents.
 * @returns {Promise<SourceMap} Parsed source map object.
 */
async function getSourceMap(
  fileUri: string,
  fileContents: string,
  sourceStorage: SourceStorage
): Promise<SourceMap> {
  let rawSourceMap;
  const sourceMappingUrl = await extractSourceMappingUrl(fileUri, fileContents);

  if (sourceMappingUrl.indexOf('data:') === 0) {
    // Parse base64 inline source map
    const base64re = /^data:application\/json;([\w=:"-]+;)*base64,/;
    const base64Match = sourceMappingUrl.match(base64re);

    if (!base64Match) {
      throw new Error(
        'Sorry, non-base64 inline source-map encoding is not supported.'
      );
    }

    rawSourceMap = sourceMappingUrl.substring(base64Match[0].length);
    rawSourceMap = window.atob(rawSourceMap);
    rawSourceMap = JSON.parse(rawSourceMap);
  } else {
    // Fetch external source map file from dev API
    const lastSlashIndex = fileUri.lastIndexOf('/');
    const fileName =
      fileUri.substring(0, lastSlashIndex + 1) + sourceMappingUrl;

    rawSourceMap = await fetch(sourceStorage.getFileSourceUrl(fileName)).then(
      res => res.json()
    );
  }

  // Parse source maps from raw source map JSON
  return new SourceMap(await new SourceMapConsumer(rawSourceMap));
}

export { extractSourceMappingUrl, getSourceMap };
