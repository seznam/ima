// TODO Use @ima types
declare module '@ima/core' {
  global {
    let $Debug: boolean;
  }

  export interface Dictionary {
    has(key: string): boolean;
    get(key: string): string;
  }

  export function defaultCssClasses(): void;
}
