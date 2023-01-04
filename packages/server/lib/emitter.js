const { Emitter, createEvent } = require('@esmj/emitter');

const Event = {
  BeforeError: 'ima.server.beforeError',
  Error: 'ima.server.error',
  AfterError: 'ima.server.afterError',

  ContentVariables: 'ima.server.contentVariables',

  BeforeRequest: 'ima.server.beforeRequest',
  Request: 'ima.server.request',
  AfterRequest: 'ima.server.afterRequest',

  BeforeResponse: 'ima.server.beforeResponse',
  Response: 'ima.server.response',
  AfterResponse: 'ima.server.afterResponse',

  CreateBootConfig: 'ima.server.bootConfig',
  CreateImaApp: 'ima.server.createApp',
};

module.exports = {
  Emitter,
  createEvent,
  Event,
};
