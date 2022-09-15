declare module '@ima/helpers' {
  export function allPromiseHash(hash: {
    [key: string]: unknown | Promise<unknown>;
  }): Promise<unknown>;
  export function processContent(options: Record<string, unknown>): string;
}
