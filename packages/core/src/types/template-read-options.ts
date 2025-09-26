import { OpenMode } from 'node:fs';
import { Abortable } from 'node:events';

export type TemplateReadOptions =
  | ({
      encoding: BufferEncoding;
      flag?: OpenMode | undefined;
    } & Abortable)
  | BufferEncoding;
