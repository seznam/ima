declare module '*.less' {
  const use: (args?: Record<string, unknown>) => void;

  export { use };
}
