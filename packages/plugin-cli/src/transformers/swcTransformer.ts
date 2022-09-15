import { Options, transform } from '@swc/core';

import { Transformer } from '../types';

const TSX_RE = /\.tsx?/;

export type SWCTransformerOptions = Options;

export function swcTransformer(options: SWCTransformerOptions): Transformer {
  return async ({ source }) => {
    const { code, map } = await transform(source.code, options);

    const newFilename = source.fileName.replace(TSX_RE, '.js');

    return {
      fileName: newFilename,
      code: map ? code + `\n//# sourceMappingURL=${newFilename}.map` : code,
      map,
    };
  };
}
