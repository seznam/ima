class SourceStorage {
  private sourceStorage = new Map();

  async getSource(fileUri: string): Promise<string> {
    if (this.sourceStorage.has(fileUri)) {
      return this.sourceStorage.get(fileUri);
    }

    const response = await fetch(
      `/__get-internal-source?fileName=${encodeURIComponent(fileUri)}`
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const fileSource = await response.text();
    this.sourceStorage.set(fileUri, fileSource);

    return fileSource;
  }

  setSource(fileUri: string, fileSource: string) {
    this.sourceStorage.set(fileUri, fileSource);
  }
}

const sourceStorage = new SourceStorage();
export { sourceStorage };
