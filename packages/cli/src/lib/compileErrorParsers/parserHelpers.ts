export interface ParsedCompileError {
  name: string;
  message: string;
  fileUri?: string;
  lineNumber?: number;
  columnNumber?: number;
}

const RE_FILE_PATH_REGEX = /\.?(\/[^/\n :,]+)+/;
const RE_VALID_FRAME_CHROME = /^\s*(at|in)\s.+(:\d+)/;
const RE_VALID_FRAME_FIREFOX =
  /(^|\/?@)\S+:\d+|.+line\s+\d+\s+>\s+(eval|Function).+/;

/**
 * Parsers error location from error.loc string from webpack stats.
 */
function extractErrorLoc(errorLocation?: string): [number, number] | [] {
  if (!errorLocation || !errorLocation.includes(':')) {
    return [];
  }

  const [line, columns] = errorLocation.split(':');
  const column = (columns.includes('-') ? columns.split('-') : columns)[0];

  // Columns are indexed from 0 so we need to compensate for that
  return [parseInt(line), parseInt(column) + 1];
}

/**
 * Extracts fileUri from module identifier string, containing used loaders.
 * The fileUri should always be at the end, separated by ! character.
 */
function extractFileUri(moduleIdentifier: string): string | undefined {
  return moduleIdentifier.includes('!')
    ? moduleIdentifier.split('!').pop() ?? undefined
    : moduleIdentifier;
}

export {
  RE_FILE_PATH_REGEX,
  RE_VALID_FRAME_CHROME,
  RE_VALID_FRAME_FIREFOX,
  extractErrorLoc,
  extractFileUri,
};
