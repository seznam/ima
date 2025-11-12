const util = require('util');

var root = typeof window !== 'undefined' && window !== null ? window : global;
root.$IMA = root.$IMA || {};
root.$IMA.Test = true;
root.$IMA.$Debug = true;
root.$Debug = true;

root.extend = extend;
root.using = using;

root.TextEncoder = util.TextEncoder;
root.TextDecoder = util.TextDecoder;

function using(values, func) {
  for (var i = 0, count = values.length; i < count; i++) {
    if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
      values[i] = [values[i]];
    }
    func.apply(this, values[i]);
  }
}

function extend(ChildClass, ParentClass) {
  ChildClass.prototype = new ParentClass();
  ChildClass.prototype.constructor = ChildClass;
}

global.window = global.window || {};
global.window.MessageChannel = jest.fn().mockImplementation(() => {
  let onmessage;
  return {
    port1: {
      set onmessage(cb) {
        onmessage = cb;
      },
    },
    port2: {
      postMessage: data => {
        onmessage?.({ data });
      },
    },
  };
});
