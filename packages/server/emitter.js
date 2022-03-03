const { Emitter, Event, createEvent, catchError } = require('./hooks');

const IMAEvent = {
  ...Event,

  BeforeRequest: 'ima.server.beforeRequest',
  Request: 'ima.server.request',
  RequestError: 'ima.server.requestError',
  AfterRequest: 'ima.server.afterRequest',
  BeforeResponse: 'ima.server.beforeResponse',
  Response: 'ima.server.response',
  AfterResponse: 'ima.server.afterResponse',
  Error: 'ima.server.error',

  CreateBootConfig: 'ima.server.bootConfig',
  CreateImaApp: 'ima.server.createApp'
};

module.exports = {
  Emitter,
  createEvent,
  catchError,
  Event: IMAEvent
};
