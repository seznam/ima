import { Options, transform } from '@swc/core';

import { Transformer } from '../types';

const EXTENSION_TRANSFORM_RE = /\.(t|j)sx?/;

export type SWCTransformerOptions = Options;

export function swcTransformer(options: SWCTransformerOptions): Transformer {
  return async ({ source }) => {
    const { code, map } = await transform(source.code, options);
    const newFilename = source.fileName.replace(EXTENSION_TRANSFORM_RE, '.js');

    return {
      fileName: newFilename,
      code: map ? code + `\n//# sourceMappingURL=${newFilename}.map` : code,
      map,
    };
  };
}
