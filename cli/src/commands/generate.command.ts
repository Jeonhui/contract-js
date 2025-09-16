import { CAC } from 'cac';
import { Contract } from '@contract-js/core';
import { z } from 'zod';

export type GenerateCommandOptions = {
  templatePath: string;
  outputPath: string;
};

const generateCommandOptionsSchema = z.object({
  templatePath: z.string().nonempty(),
  outputPath: z.string().nonempty(),
});

export const generateCommand = (cli: CAC) => {
  cli
    .command('generate', 'generate contract')
    .option('-t, --template <template>', 'Template file path')
    .option('-o, --output <output>', 'Output file path', {
      default: './output.pdf',
    })
    .action(async (opts) => {
      const options = generateCommandOptionsSchema.parse({
        templatePath: opts.template,
        outputPath: opts.output,
      });
      const contract = new Contract({
        templatePath: options.templatePath,
      });
      await contract.generate();
    });
};
