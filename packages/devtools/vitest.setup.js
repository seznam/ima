import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import { vi } from 'vitest';

// Configure Enzyme for React 17 environment
configure({ adapter: new Adapter() });

// Mock chrome global
globalThis.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
};
