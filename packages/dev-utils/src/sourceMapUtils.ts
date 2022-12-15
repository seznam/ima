import { RE_SOURCE_MAPPING_URL } from './helpers';

/**
 * Extracts sourceMappingURL from the provided file contents.
 * Based on https://github.com/facebook/create-react-app/blob/main/packages/react-error-overlay/src/utils/getSourceMap.js#L79.
 *
 * @param {string} fileUri The uri of the source file.
 * @param {string} fileContents Source file file contents.
 * @returns {string|null}
 */
function extractSourceMappingUrl(
  fileUri: string,
  fileContents: string
): string | null {
  let match: RegExpExecArray | null = null;

  for (;;) {
    const next = RE_SOURCE_MAPPING_URL.exec(fileContents);

    if (next == null) {
      break;
    }

    match = next;
  }

  if (!(match && match[1])) {
    return null;
  }

  const sourceMappingUrl = match[1].toString();

  // Inline base64 source map
  if (sourceMappingUrl.includes('data:')) {
    throw new Error(
      `Sorry, base64 inline source-map encoding is not supported ${fileUri}.`
    );
  }

  // Prefix source map filename with path from fileUri
  const lastSlashIndex = fileUri.lastIndexOf('/');
  const mapFileUri =
    fileUri.substring(0, lastSlashIndex + 1) + sourceMappingUrl;

  return mapFileUri;
}

export { extractSourceMappingUrl };
