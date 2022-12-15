declare module 'preprocess' {
  export type PreprocessContext = Record<
    string,
    boolean | number | string | undefined | null
  >;

  export type PreprocessType =
    | 'html'
    | 'xml'
    | 'js'
    | 'javascript'
    | 'jsx'
    | 'json'
    | 'c'
    | 'cc'
    | 'cpp'
    | 'cs'
    | 'csharp'
    | 'java'
    | 'less'
    | 'sass'
    | 'scss'
    | 'css'
    | 'php'
    | 'ts'
    | 'tsx'
    | 'peg'
    | 'pegjs'
    | 'jade'
    | 'styl'
    | 'coffee'
    | 'bash'
    | 'shell'
    | 'sh';

  function preprocess(
    source: string,
    context: PreprocessContext,
    type: PreprocessType
  ): string;

  export { preprocess };
}
