import { defaultCssClasses } from './componentHelpers';

declare module '@ima/core' {
  interface Utils {
    $CssClasses: typeof defaultCssClasses;
  }

  export interface PageRendererSettings {
    resolveAfterRender?: boolean;
  }
}

export {};
