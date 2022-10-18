const util = require('util');

var root = typeof window !== 'undefined' && window !== null ? window : global;

root.TextEncoder = util.TextEncoder;
root.TextDecoder = util.TextDecoder;
