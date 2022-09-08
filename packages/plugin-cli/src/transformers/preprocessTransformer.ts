import path from 'path';

import { preprocess, PreprocessContext, PreprocessType } from 'preprocess';

import { Transformer } from '../types';

export interface PreprocessTransformerOptions {
  context: PreprocessContext;
}

export function preprocessTransformer(
  options: PreprocessTransformerOptions
): Transformer {
  return async ({ source, context }) => {
    const extension = path.extname(context.fileName).slice(1);
    const code = preprocess(
      source.code,
      options.context,
      extension as PreprocessType
    );

    return {
      ...source,
      code,
    };
  };
}
