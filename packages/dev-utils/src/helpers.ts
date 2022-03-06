// Stack frame parsing related reg-exps
const RE_VALID_FRAME_CHROME = /^\s*(at|in)\s.+(:\d+)/;
const RE_VALID_FRAME_FIREFOX =
  /(^|\/?@)\S+:\d+|.+line\s+\d+\s+>\s+(eval|Function).+/;

/**
 * Used to extract source mapping url injected at the end
 * of a file with generated source maps (in separate file).
 */
const RE_SOURCE_MAPPING_URL = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;

export { RE_VALID_FRAME_CHROME, RE_VALID_FRAME_FIREFOX, RE_SOURCE_MAPPING_URL };
