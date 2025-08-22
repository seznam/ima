import { ParseResult } from '@babel/parser';
import { File } from '@babel/types';

export type UseServerProcessor = (ast: ParseResult<File>) => ParseResult<File>;
