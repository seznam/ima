const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

global.chrome = {
  storage: {
    local: {
      get: () => {},
      set: () => {}
    }
  }
};

enzyme.configure({ adapter: new Adapter() });
