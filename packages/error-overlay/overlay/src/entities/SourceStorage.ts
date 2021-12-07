import { SourceMap } from '#/entities';
import { getSourceMap } from '#/utils';

interface SourceStorageEntry {
  fileContents: string | null;
  sourceMap: SourceMap | null;
}

/**
 * Singleton class used to cache fetched source files nad their source maps.
 * It also aggregates multiple requests to the same file into one single promise,
 * which simplifies the usage and management of fetching file sources manually.
 */
class SourceStorage {
  private _sourceStorage = new Map<
    string,
    Promise<SourceStorageEntry | null>
  >();

  /**
   * Fetch file contents and it's source map. This function aggregates multiple requests
   * to the same file into single fetch request. This means, it can be used multiple times
   * without additional check for duplicity. If the file contents source code is already fetched,
   * the contents are retrieved from memory cache.
   *
   * @param {string} fileUri.
   * @param {string} [hasSourceMap=true] Set to true if you want to fetch source maps too.
   * @returns {SourceStorageEntry | null}
   */
  async get(
    fileUri: string,
    hasSourceMap = true
  ): Promise<SourceStorageEntry | null> {
    if (!this._sourceStorage.has(fileUri)) {
      this._sourceStorage.set(
        fileUri,
        this._fetchFileContents(fileUri).then(async fileContents => {
          if (!fileContents) {
            return null;
          }

          return {
            fileContents,
            sourceMap: hasSourceMap
              ? await this._fetchSourceMap(fileUri, fileContents)
              : null
          };
        })
      );
    }

    return this._sourceStorage.get(fileUri) ?? null;
  }

  /**
   * Returns URL to internal source dev API route with properly encoded
   * fileName query param or to the actual static file, if the uri is not relative.
   *
   * @returns {string}
   */
  getFileSourceUrl(fileUri: string) {
    if (fileUri.startsWith('http')) {
      return fileUri;
    }

    return `/__get-internal-source?fileName=${encodeURIComponent(fileUri)}`;
  }

  /**
   * Fetch file contents from dev server API.
   *
   * @param {string} fileUri The uri of the source file.
   * @returns {Promise<string | null>}
   */
  private async _fetchFileContents(fileUri: string): Promise<string | null> {
    let fileContents = null;

    try {
      const response = await fetch(this.getFileSourceUrl(fileUri));

      if (!response.ok) {
        return fileContents;
      }

      fileContents = response.text();
    } catch (error) {
      console.warn(`Unable to fetch file contents for ${fileUri}.`, error);
    }

    return fileContents;
  }

  /**
   * Fetch source map for file with given source and fileUri.
   *
   * @param {string} fileUri The uri of the source file.
   * @param {string} fileContents Source file file contents.
   * @returns {Promise<SourceMap | null>}
   */
  private async _fetchSourceMap(
    fileUri: string,
    fileContents: string
  ): Promise<SourceMap | null> {
    let sourceMap = null;

    try {
      sourceMap = await getSourceMap(fileUri, fileContents);
    } catch (error) {
      console.warn(`Unable to get source map for ${fileUri}.`, error);
    }

    return sourceMap;
  }
}

const sourceStorage = new SourceStorage();
export { sourceStorage, SourceStorageEntry };
