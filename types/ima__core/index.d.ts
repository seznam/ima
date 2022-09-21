// TODO Use @ima types
declare module '@ima/core' {
  global {
    var $Debug: boolean;
  }

  export interface Dictionary {
    has(key: string): boolean;
    get(key: string): string;
  }

  export function defaultCssClasses(): void;
}
