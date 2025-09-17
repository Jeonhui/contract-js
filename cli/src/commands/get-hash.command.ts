import { CAC } from 'cac';
import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import { getPdfHash } from '@contract-js/pdf-utils';

export type GetHashCommandOptions = {
  filePath: string;
  algorithm?: string;
};

const getHashCommandOptionsSchema = z.object({
  filePath: z.string().min(1, 'File path is required'),
  algorithm: z.string().optional().default('sha256'),
});

export const getHashCommand = (cli: CAC) => {
  cli
    .command('hash', 'Generate hash for a file')
    .option('-f, --file <file>', 'File path to hash')
    .option('-a, --algorithm <algorithm>', 'Hash algorithm', {
      default: 'sha256',
    })
    .action(async (opts) => {
      try {
        const options = getHashCommandOptionsSchema.parse({
          filePath: opts.file,
          algorithm: opts.algorithm,
        });
        console.log(`Generating ${options.algorithm} hash...`);
        console.log(`File: ${options.filePath}`);
        const fileBuffer = await readFile(options.filePath);
        const pdfHash = getPdfHash(fileBuffer, {
          hashAlgorithm: options.algorithm,
        });
        console.log(`✅ Hash generated successfully!`);
        console.log(`🔐 ${options.algorithm.toUpperCase()}: ${pdfHash}`);
        console.log(`📊 File size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);
      } catch (error) {
        console.error(
          '❌ Failed to generate hash:',
          error instanceof Error ? error.message : 'Unknown error',
        );
        process.exit(1);
      }
    });
};
