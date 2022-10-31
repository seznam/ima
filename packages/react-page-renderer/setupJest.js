const util = require('util');

var root = typeof window !== 'undefined' && window !== null ? window : global;

root.TextEncoder = util.TextEncoder;
root.TextDecoder = util.TextDecoder;

const Adapter = require('@cfaester/enzyme-adapter-react-18').default;
const enzyme = require('enzyme');

enzyme.configure({ adapter: new Adapter() });
