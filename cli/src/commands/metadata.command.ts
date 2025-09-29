import { CAC } from 'cac';
import { z } from 'zod';
import * as p from '@clack/prompts';
import color from 'picocolors';
import { readFile } from 'node:fs/promises';
import { getPdfMetadata } from '@contract-js/core';

const metadataCommandOptionsSchema = z.object({
  contractPath: z
    .string()
    .regex(/\.pdf$/, {
      message: 'Contract file must be a PDF file with .pdf extension.',
    })
    .nonempty('Contract file path is required'),
});

export const metadataCommand = (cli: CAC) => {
  cli
    .command('metadata <filePath>', 'Get metadata from a contract PDF file')
    .example('contract-js metadata contract.pdf')
    .action(async (ctr) => {
      p.intro(
        color.bgBlue(color.white(' 📋 metadata ')) +
          color.gray(' - extract metadata from PDF files'),
      );
      const options = metadataCommandOptionsSchema.parse({
        contractPath: ctr,
      });
      const { contractPath } = options;
      try {
        p.log.step(color.blue('⚙️  Configuration'));
        p.log.info(color.gray(`   📄 File: ${color.cyan(contractPath)}`));

        p.log.step(color.yellow('📂 Reading PDF file...'));
        const fileBuffer = await readFile(contractPath);
        p.log.success(color.green(`✓ File loaded successfully`));
        p.log.info(
          color.gray(`   📏 Size: ${color.white((fileBuffer.length / 1024).toFixed(2))} KB`),
        );

        const { start, stop } = p.spinner();
        start(color.green('🔄 Extracting PDF metadata...'));
        const metadata = await getPdfMetadata(fileBuffer);
        stop();

        p.log.success(color.green(`✨ Metadata extracted successfully!`));

        p.log.step(color.blue('📋 PDF Metadata'));

        if (metadata.title) {
          p.log.info(color.gray(`   📝 Title: ${color.white(metadata.title)}`));
        }
        if (metadata.author) {
          p.log.info(color.gray(`   👤 Author: ${color.white(metadata.author)}`));
        }
        if (metadata.subject) {
          p.log.info(color.gray(`   📄 Subject: ${color.white(metadata.subject)}`));
        }
        if (metadata.keywords && metadata.keywords.length > 0) {
          p.log.info(color.gray(`   🏷️ Keywords: ${color.white(metadata.keywords.join(', '))}`));
        }
        if (metadata.creator) {
          p.log.info(color.gray(`   🛠️Creator: ${color.white(metadata.creator)}`));
        }
        if (metadata.producer) {
          p.log.info(color.gray(`   🏭 Producer: ${color.white(metadata.producer)}`));
        }
        if (metadata.createDate) {
          p.log.info(
            color.gray(`   📅 Created: ${color.white(metadata.createDate.toISOString())}`),
          );
        }
        if (metadata.modDate) {
          p.log.info(color.gray(`   📅 Modified: ${color.white(metadata.modDate.toISOString())}`));
        }

        const hasMetadata =
          metadata.title ||
          metadata.author ||
          metadata.subject ||
          metadata.keywords?.length ||
          metadata.creator ||
          metadata.producer ||
          metadata.createDate ||
          metadata.modDate;

        if (!hasMetadata) {
          p.log.warn(color.yellow(`⚠️  No metadata found in this PDF file`));
        }

        p.log.info(color.gray(`   📄 File: ${color.cyan(contractPath)}`));
        p.log.info(
          color.gray(`   📏 Size: ${color.white((fileBuffer.length / 1024).toFixed(2))} KB`),
        );

        p.outro(color.green('🎉 Metadata extraction completed!'));
        process.exit(0);
      } catch (error) {
        p.log.error(
          color.red(
            `💥 Failed to extract metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ),
        );
        p.outro(color.red('❌ Process terminated due to error.'));
        process.exit(1);
      }
    });
};
