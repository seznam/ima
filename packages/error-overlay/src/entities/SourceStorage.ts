import { extractSourceMappingUrl } from '@ima/dev-utils/sourceMapUtils';
import { RawSourceMap, SourceMapConsumer } from 'source-map-js';

interface SourceStorageEntry {
  rootDir?: string;
  fileContents: string | null;
  sourceMap: SourceMapConsumer | null;
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

  public publicUrl: string;

  constructor(publicUrl: string) {
    this.publicUrl = publicUrl;
  }

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
        this._fetchFile(fileUri).then(async file => {
          if (!file) {
            return null;
          }

          const { source, rootDir } = file;

          return {
            rootDir,
            fileContents: source,
            sourceMap: hasSourceMap
              ? await this._fetchSourceMap(fileUri, source)
              : null,
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

    return `${
      this.publicUrl
    }/__get-internal-source?fileName=${encodeURIComponent(fileUri)}`;
  }

  /**
   * Empties loaded sources maps.
   */
  async cleanup(): Promise<void> {
    this._sourceStorage.clear();
  }

  /**
   * Fetch file contents from dev server API.
   *
   * @param {string} fileUri The uri of the source file.
   * @returns {Promise<string | null>}
   */
  private async _fetchFile(
    fileUri: string
  ): Promise<{ source: string; rootDir?: string } | null> {
    try {
      const response = await fetch(this.getFileSourceUrl(fileUri), {
        headers: {
          'cache-control': 'no-cache',
        },
      });

      if (!response.ok) {
        return null;
      }

      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const { source, rootDir } = await response.json();

        return {
          source,
          rootDir,
        };
      } else {
        return { source: await response.text() };
      }
    } catch (error) {
      console.warn(`Unable to fetch file contents for ${fileUri}.`, error);
    }

    return null;
  }

  /**
   * Fetch source map for file with given source and fileUri.
   *
   * @param {string} fileUri The uri of the source file.
   * @param {string} fileContents Source file file contents.
   * @returns {Promise<SourceMapConsumer | null>}
   */
  private async _fetchSourceMap(
    fileUri: string,
    fileContents: string
  ): Promise<SourceMapConsumer | null> {
    try {
      // Extract source mapping url from source file
      const sourceMapUrl = extractSourceMappingUrl(fileUri, fileContents);

      if (!sourceMapUrl) {
        return null;
      }

      // Fetch source map
      const rawSourceMap = (await fetch(this.getFileSourceUrl(sourceMapUrl), {
        headers: {
          'cache-control': 'no-cache',
        },
      }).then(async res => {
        const data = await res.json();

        // Either return source from internal source middleware or data from hot.js file
        return data.source ? data.source : data;
      })) as RawSourceMap;

      if (!sourceMapUrl) {
        return null;
      }

      return new SourceMapConsumer(rawSourceMap);
    } catch (error) {
      console.warn(error);
    }

    return null;
  }
}

export { SourceStorage, type SourceStorageEntry };
