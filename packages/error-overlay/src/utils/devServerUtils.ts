function getDevServerBaseUrl(): string {
  return `http://localhost:${window.parent.__ima_hmr.options.port}`;
}

export { getDevServerBaseUrl };
