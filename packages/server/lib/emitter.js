const { Emitter, Event, createEvent, catchError } = require('@esmj/emitter');

const IMAEvent = {
  ...Event,

  BeforeError: 'ima.server.beforeError',
  AfterError: 'ima.server.afterError',

  BeforeRequest: 'ima.server.beforeRequest',
  Request: 'ima.server.request',
  AfterRequest: 'ima.server.afterRequest',
  RequestError: 'ima.server.requestError',
  BeforeResponse: 'ima.server.beforeResponse',
  Response: 'ima.server.response',
  AfterResponse: 'ima.server.afterResponse',

  CreateBootConfig: 'ima.server.bootConfig',
  CreateImaApp: 'ima.server.createApp',
};

module.exports = {
  Emitter,
  createEvent,
  catchError,
  Event: IMAEvent,
};
