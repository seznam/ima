// TODO
function getDevServerBaseUrl(): string {
  return `http://${window.parent.__ima_hmr.options.public}`;
}

export { getDevServerBaseUrl };
