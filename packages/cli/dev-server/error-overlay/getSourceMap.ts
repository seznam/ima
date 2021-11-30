import { SourceMapConsumer, BasicSourceMapConsumer } from 'source-map';
import fetch from 'node-fetch';
import SourceMap from './SourceMap';

function extractSourceMapUrl(
  fileUri: string,
  fileContents: string
): Promise<string> {
  const regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
  let match: RegExpExecArray | null = null;

  for (;;) {
    const next = regex.exec(fileContents);

    if (next == null) {
      break;
    }

    match = next;
  }

  if (!(match && match[1])) {
    return Promise.reject(`Cannot find a source map directive for ${fileUri}.`);
  }

  return Promise.resolve(match[1].toString());
}

/**
 * Returns an instance of <code>{@link SourceMap}</code> for a given fileUri and fileContents.
 * @param {string} fileUri The URI of the source file.
 * @param {string} fileContents The contents of the source file.
 */
async function getSourceMap(
  fileUri: string,
  fileContents: string
): Promise<SourceMap> {
  let sm = await extractSourceMapUrl(fileUri, fileContents);
  console.log(sm);

  if (sm.indexOf('data:') === 0) {
    const base64 = /^data:application\/json;([\w=:"-]+;)*base64,/;
    const match2 = sm.match(base64);
    if (!match2) {
      throw new Error(
        'Sorry, non-base64 inline source-map encoding is not supported.'
      );
    }
    sm = sm.substring(match2[0].length);
    sm =
      typeof window !== 'undefined'
        ? window.atob(sm)
        : Buffer.from(sm, 'base64').toString();
    sm = JSON.parse(sm);

    return new SourceMap(
      (await new SourceMapConsumer(sm)) as BasicSourceMapConsumer
    );
  } else {
    const index = fileUri.lastIndexOf('/');
    const url = fileUri.substring(0, index + 1) + sm;
    const obj = await fetch(url).then(res => res.json());

    // TODO
    return new SourceMap(
      (await new SourceMapConsumer(obj)) as BasicSourceMapConsumer
    );
  }
}

export { extractSourceMapUrl, getSourceMap };
