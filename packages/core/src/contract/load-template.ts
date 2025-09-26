import { readFile } from 'node:fs/promises';
import { OpenMode } from 'node:fs';
import { Abortable } from 'node:events';

export const loadTemplate = async ({
  templatePath,
  templateOptions = 'utf-8',
}: {
  templatePath: string;
  templateOptions?:
    | ({
        encoding: BufferEncoding;
        flag?: OpenMode | undefined;
      } & Abortable)
    | BufferEncoding;
}): Promise<string> => {
  try {
    return await readFile(templatePath, templateOptions);
  } catch (error) {
    throw new Error(
      `Failed to read template file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
