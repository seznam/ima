import {
  objectKeepUnmock,
  setGlobalKeepUnmock,
  setGlobalMockMethod,
} from 'to-mock';

setGlobalMockMethod(vi.fn);
setGlobalKeepUnmock(objectKeepUnmock);
