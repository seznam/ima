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
): Promise<string | null> {
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
    return null;
  }

  const sourceMappingUrl = match[1].toString();

  // Inline base64 source map
  if (sourceMappingUrl.includes('data:')) {
    return Promise.reject(
      `Sorry, base64 inline source-map encoding is not supported ${fileUri}.`
    );
  }

  const lastSlashIndex = fileUri.lastIndexOf('/');
  const mapFileUri =
    fileUri.substring(0, lastSlashIndex + 1) + sourceMappingUrl;

  return Promise.resolve(mapFileUri);
}

export { extractSourceMappingUrl };
