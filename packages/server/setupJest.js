import {
  objectKeepUnmock,
  setGlobalKeepUnmock,
  setGlobalMockMethod,
} from 'to-mock';

setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);
