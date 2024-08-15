import '@testing-library/jest-dom';
// @TODO It would be nice to mock fetch also, but there are some issues with fetch-mock being esm only, while
// we are importing it from commonjs. We should investigate this further.
// import fetchMock from 'fetch-mock';

// global.fetch = fetchMock.sandbox() as typeof fetch;
