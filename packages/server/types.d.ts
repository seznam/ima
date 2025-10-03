import { Emitter } from '@esmj/emitter';
import { Environment, ParsedEnvironment } from '@ima/core';
import { Request } from 'express';

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
    AfterResponseSend = 'ima.server.afterResponseSend',

    CreateBootConfig = 'ima.server.bootConfig',
    CreateImaApp = 'ima.server.createApp',
  }

  export function createIMAServer(params: {
    applicationFolder?: string;
    processEnvironment?: (environment: Environment) => Environment;
    environment?: Environment;
    logger?: any;
    emitter?: Emitter;
    performance?: any;
    devUtils?: any;
  });

  export function sanitizeValue(value: unknown): null | string;
  export function renderStyles(styles: any[]): string;
  export function renderScript(name: string, script: string): string;
  export function environmentFactory(args: {
    applicationFolder: string;
  }): ParsedEnvironment;

  export function urlParserFactory(params: {
    environment: Environment;
    applicationFolder: string;
  }): {
    getHost: (req: Request) => string;
    getProtocol: (req: Request) => string;
  };
}
