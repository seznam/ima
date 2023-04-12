declare module '@ima/server' {
  export enum Event {
    BeforeError = 'ima.server.beforeError',
    Error = 'ima.server.error',
    AfterError = 'ima.server.afterError',

    CreateContentVariables = 'ima.server.createContentVariables',

    BeforeRequest = 'ima.server.beforeRequest',
    Request = 'ima.server.request',
    AfterRequest = 'ima.server.afterRequest',

    BeforeResponse = 'ima.server.beforeResponse',
    Response = 'ima.server.response',
    AfterResponse = 'ima.server.afterResponse',

    CreateBootConfig = 'ima.server.bootConfig',
    CreateImaApp = 'ima.server.createApp',
  }
}
