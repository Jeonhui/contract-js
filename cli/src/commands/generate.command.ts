import { CAC } from 'cac';
import { z } from 'zod';
import { generatePdf } from '@contract-js/core';
import { writeFile, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

export type GenerateCommandOptions = {
  templatePath: string;
  outputPath: string;
  data?: string;
};

const generateCommandOptionsSchema = z.object({
  templatePath: z.string().min(1, 'Template path is required'),
  outputPath: z.string().min(1, 'Output path is required'),
  data: z.string().optional(),
});

export const generateCommand = (cli: CAC) => {
  cli
    .command('generate', 'Generate contract PDF from EJS template')
    .option('-t, --template <template>', 'EJS template file path')
    .option('-o, --output <output>', 'Output PDF file path', {
      default: '.temp/contract.pdf',
    })
    .option('-d, --data <data>', 'JSON data file path for template variables')
    .action(async (opts) => {
      try {
        const options = generateCommandOptionsSchema.parse({
          templatePath: opts.template,
          outputPath: opts.output,
          data: opts.data,
        });
        let templateData = {};
        if (options.data) {
          console.log(options.data);
          try {
            const dataContent = await readFile(options.data, 'utf-8');
            templateData = JSON.parse(dataContent);
          } catch (error) {
            console.warn(
              `Warning: Could not load data file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            );
          }
        }
        console.log('Generating contract...');
        console.log(`Template: ${options.templatePath}`);
        console.log(`Output: ${options.outputPath}`);
        await mkdir(dirname(options.outputPath), { recursive: true });
        const { pdfBuffer, pdfHash } = await generatePdf({
          templatePath: options.templatePath,
          templateData,
        });
        const fileSize = (pdfBuffer.length / 1024).toFixed(2);
        await writeFile(options.outputPath, pdfBuffer);
        console.log(`✅ Contract generated successfully!`);
        console.log(`📄 PDF saved to: ${options.outputPath}`);
        console.log(`🔒 PDF hash: ${pdfHash}`);
        console.log(`📊 File size: ${fileSize} KB`);
        console.log('Done!');
        process.exit(0);
      } catch (error) {
        console.error(
          '❌ Failed to generate contract:',
          error instanceof Error ? error.message : 'Unknown error',
        );
        process.exit(1);
      }
    });
};
