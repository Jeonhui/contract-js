import { CAC } from 'cac';
import { z } from 'zod';
import * as p from '@clack/prompts';
import color from 'picocolors';
import { generatePdf, loadTemplate } from '@contract-js/core';
import { writeFile, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

const generateCommandOptionsSchema = z.object({
  templatePath: z
    .string()
    .regex(/\.ejs$/, {
      message: 'Template file must be an EJS file with .ejs extension.',
    })
    .nonempty('Template file path is required'),
  templateDataPath: z
    .string()
    .regex(/\.json$/, {
      message: 'Template data file must be a JSON file with .json extension.',
    })
    .optional(),
  outputPath: z
    .string()
    .regex(/\.pdf$/, {
      message: 'Output file must be a PDF file with .pdf extension.',
    })
    .nonempty('Output file path is required')
    .default('contract.pdf'),
});

export const generateCommand = (cli: CAC) => {
  cli
    .command('generate <template>', 'Generate contract PDF from EJS template')
    .option('-d, --data <data>', 'JSON data file path for template variables (JSON format)')
    .option('-o, --output <output>', 'Output PDF file path (PDF format)')
    .example('contract-js generate template.ejs')
    .example('contract-js generate template.ejs -d data.json')
    .example('contract-js generate template.ejs -d data.json -o contract.pdf')
    .action(async (tmp, opts) => {
      p.intro(
        color.bgBlue(color.white(' 📄 generate')) +
          color.gray(' - Generate beautiful PDF contracts from EJS templates'),
      );

      const options = generateCommandOptionsSchema.parse({
        templatePath: tmp,
        templateDataPath: opts.data,
        outputPath: opts.output,
      });
      const { templatePath, templateDataPath, outputPath } = options;
      let templateData = {};

      if (templateDataPath) {
        try {
          p.log.step(color.yellow('📂 Loading template data...'));
          const dataContent = await readFile(templateDataPath, 'utf-8');
          templateData = JSON.parse(dataContent);
          p.log.success(color.green(`✓ Loaded data from ${color.cyan(templateDataPath)}`));
        } catch (error) {
          p.log.error(
            color.red(
              `❌ Could not read template data file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ),
          );
          p.outro(color.red('💥 Exiting due to error...'));
          process.exit(1);
        }
      } else {
        p.log.info(color.yellow('ℹ️  No template data provided, using empty object'));
      }

      const { start, stop } = p.spinner();
      try {
        const outputFile = outputPath.split('/').pop() || 'contract.pdf';

        p.log.step(color.blue('⚙️  Configuration'));
        p.log.info(color.gray(`   📄 Template: ${color.cyan(templatePath)}`));
        p.log.info(color.gray(`   📝 Output: ${color.cyan(outputPath)}`));
        p.log.info(
          color.gray(
            `   📊 Data: ${
              Object.keys(templateData).length > 0
                ? color.green(`${Object.keys(templateData).length} properties`)
                : color.yellow('No data provided')
            }`,
          ),
        );

        if (Object.keys(templateData).length > 0) {
          p.log.info(color.gray('   📋 Template variables:'));
          Object.entries(templateData).forEach(([key, value]) => {
            const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
            const truncatedValue =
              valueStr.length > 50 ? valueStr.substring(0, 47) + '...' : valueStr;
            p.log.info(color.gray(`      ${color.cyan(key)}: ${color.white(truncatedValue)}`));
          });
        }

        await mkdir(dirname(outputPath), { recursive: true });

        start(color.blue(`📂 Loading template from ${color.cyan(templatePath)}...`));
        const templateContent = await loadTemplate({
          templatePath,
        });
        stop();
        p.log.success(color.green(`✓ Template loaded successfully`));

        start(color.blue(`🔄 Generating ${color.cyan(outputFile)}...`));
        const { pdfBuffer, pdfHash, pdfKB } = await generatePdf({
          templateContent,
          templateData,
          pdfConfig: {},
        });

        await writeFile(outputPath, pdfBuffer);
        stop();

        p.log.success(color.green(`✨ Contract generated successfully!`));
        p.log.info(color.gray(`   📄 File: ${color.cyan(outputFile)}`));
        p.log.info(color.gray(`   📏 Size: ${color.white(pdfKB.toFixed(2))} KB`));
        p.log.info(color.gray(`   🔐 Hash: ${color.white(pdfHash)}`));
        p.log.info(color.gray(`   📍 Path: ${color.cyan(outputPath)}`));

        p.outro(color.green('🎉 All done! Your contract is ready to use.'));
        process.exit(0);
      } catch (error) {
        stop();
        p.log.error(
          color.red(
            `💥 Failed to generate contract: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ),
        );
        p.outro(color.red('❌ Process terminated due to error.'));
        process.exit(1);
      }
    });
};
