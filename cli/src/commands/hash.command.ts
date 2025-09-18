import { CAC } from 'cac';
import { z } from 'zod';
import * as p from '@clack/prompts';
import color from 'picocolors';
import { readFile } from 'node:fs/promises';
import { getPdfHash } from '@contract-js/pdf-utils';

const hashCommandOptionsSchema = z.object({
  contractPath: z
    .string()
    .regex(/\.pdf$/, {
      message: 'Contract file must be a PDF file with .pdf extension.',
    })
    .nonempty('Contract file path is required'),
  algorithm: z
    .string()
    .optional()
    .default('sha256')
    .refine((val) => ['sha1', 'sha256', 'sha384', 'sha512'].includes(val), {
      message: 'Algorithm must be one of: sha1, sha256, sha384, sha512',
    }),
});

export const hashCommand = (cli: CAC) => {
  cli
    .command('hash <filePath>', 'Get hash from a contract PDF file')
    .option('-a, --algorithm <algorithm>', 'Hash algorithm', {
      default: 'sha256',
    })
    .example('contract-js hash contract.pdf')
    .example('contract-js hash contract.pdf -a sha256')
    .action(async (ctr, opts) => {
      p.intro(
        color.bgGreen(color.white(' 🔐 hash ')) +
          color.gray(' - get cryptographic hash from PDF files'),
      );
      const options = hashCommandOptionsSchema.parse({
        contractPath: ctr,
        algorithm: opts.algorithm,
      });
      const { contractPath, algorithm } = options;
      try {
        p.log.step(color.blue('⚙️  Configuration'));
        p.log.info(color.gray(`   📄 File: ${color.cyan(contractPath)}`));
        p.log.info(color.gray(`   🔧 Algorithm: ${color.cyan(algorithm.toUpperCase())}`));

        p.log.step(color.yellow('📂 Reading contract file...'));
        const fileBuffer = await readFile(contractPath);
        p.log.success(color.green(`✓ File loaded successfully`));
        p.log.info(
          color.gray(`   📏 Size: ${color.white((fileBuffer.length / 1024).toFixed(2))} KB`),
        );
        const { start, stop } = p.spinner();
        start(color.green(`🔄 Getting ${color.cyan(options.algorithm.toUpperCase())} hash...`));
        const pdfHash = getPdfHash(fileBuffer, {
          hashAlgorithm: options.algorithm,
        });
        stop();
        p.log.success(color.green(`✨ Hash generated successfully!`));
        p.log.info(color.gray(`   🔐 Algorithm: ${color.white(options.algorithm.toUpperCase())}`));
        p.log.info(color.gray(`   🆔 Hash: ${color.white(pdfHash)}`));
        p.log.info(color.gray(`   📄 File: ${color.cyan(contractPath)}`));
        p.log.info(
          color.gray(`   📏 Size: ${color.white((fileBuffer.length / 1024).toFixed(2))} KB`),
        );
        p.outro(color.green('🎉 Hash generation completed!'));
        process.exit(0);
      } catch (error) {
        p.log.error(
          color.red(
            `💥 Failed to generate hash: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ),
        );
        p.outro(color.red('❌ Process terminated due to error.'));
        process.exit(1);
      }
    });
};
