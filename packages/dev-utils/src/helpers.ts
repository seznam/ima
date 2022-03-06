const RE_VALID_FRAME_CHROME = /^\s*(at|in)\s.+(:\d+)/;
const RE_VALID_FRAME_FIREFOX =
  /(^|\/?@)\S+:\d+|.+line\s+\d+\s+>\s+(eval|Function).+/;

export { RE_VALID_FRAME_CHROME, RE_VALID_FRAME_FIREFOX };
