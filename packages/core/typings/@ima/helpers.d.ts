declare module '@ima/helpers' {
  export function allPromiseHash(hash: {
    [key: string]: unknown | Promise<unknown>;
  }): Promise<unknown>;
  export function processContent(options: Record<string, unknown>): string;
  export function clone<T>(
    val: T,
    circular?: boolean,
    depth?: number,
    prototype?: any,
    includeNonEnumerable?: boolean
  ): T;
}
