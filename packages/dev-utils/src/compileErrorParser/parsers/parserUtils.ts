export interface CompileError {
  name: string;
  message: string;
  fileUri?: string;
  line?: number;
  column?: number;
}

const RE_FILE_PATH_REGEX = /\.?(\/[^/\n :,]+)+/;

/**
 * Parsers error location from error.loc string from webpack stats.
 *
 * @param {string?} errorLocation Error location (line:column) string.
 * @returns { line?: number; column?: number; } parsed line & column.
 */
function extractErrorLoc(errorLocation?: string): {
  line?: number;
  column?: number;
} {
  if (!errorLocation || !errorLocation.includes(':')) {
    return {};
  }

  const [line, columns] = errorLocation.split(':');
  const column = (columns.includes('-') ? columns.split('-') : columns)[0];

  // Columns are indexed from 0 so we need to compensate for that
  return { line: parseInt(line), column: parseInt(column) + 1 };
}

/**
 * Extracts fileUri from module identifier string, containing used loaders.
 * The fileUri should always be at the end, separated by ! character.
 *
 * @param {string} moduleIdentifier webpack resource query.
 */
function extractFileUri(moduleIdentifier: string): string | undefined {
  return moduleIdentifier.includes('!')
    ? moduleIdentifier.split('!').pop() ?? undefined
    : moduleIdentifier;
}

export { RE_FILE_PATH_REGEX, extractErrorLoc, extractFileUri };
