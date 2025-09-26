import { readFile } from 'node:fs/promises';
import { TemplateReadOptions } from '../types';

export const loadTemplate = async ({
  templatePath,
  templateReadOptions = 'utf-8',
}: {
  templatePath: string;
  templateReadOptions?: TemplateReadOptions;
}): Promise<string> => {
  try {
    return await readFile(templatePath, templateReadOptions);
  } catch (error) {
    throw new Error(
      `Failed to read template file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
