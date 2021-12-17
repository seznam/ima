/* eslint-disable @typescript-eslint/no-unused-vars */
declare module 'prismjs' {
  export type Language = string;
  export type Grammar = unknown;

  export const languages: Record<PrismJS.Language, PrismJS.Grammar>;

  export const highlight = (
    source: string,
    grammar: PrismJS.Grammar,
    language: PrismJS.Language
  ) => string;
}
