(() => {
  const publicPathOverride =
    typeof window !== 'undefined'
      ? window?.$IMA.$PublicPath
      : process?.env?.IMA_PUBLIC_PATH;

  if (publicPathOverride) {
    __webpack_public_path__ = publicPathOverride;
  }
})();
