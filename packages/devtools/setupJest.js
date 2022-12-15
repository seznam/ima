const util = require('util');

var root = typeof window !== 'undefined' && window !== null ? window : global;

root.TextEncoder = util.TextEncoder;
root.TextDecoder = util.TextDecoder;

const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
const enzyme = require('enzyme');

enzyme.configure({ adapter: new Adapter() });
