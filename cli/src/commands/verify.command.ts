import { CAC } from 'cac';
import { z } from 'zod';
import * as p from '@clack/prompts';
import color from 'picocolors';
import { readFile } from 'node:fs/promises';
import { getPdfHash } from '@contract-js/pdf-utils';
import { verifyContractSignature } from '@contract-js/crypto';

const verifyCommandOptionsSchema = z.object({
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
  publicKeyPath: z
    .string()
    .regex(/\.pem$/, {
      message: 'Public key file must be a PEM file with .pem extension.',
    })
    .nonempty('Public key file path is required'),
  signaturePath: z
    .string()
    .regex(/\.txt$/, {
      message: 'Signature file must be a text file with .txt extension.',
    })
    .nonempty('Signature file path is required'),
});

export const verifyCommand = (cli: CAC) => {
  cli
    .command('verify <filePath>', 'Verify digital signature of a contract PDF file')
    .option('-a, --algorithm <algorithm>', 'Hash algorithm', {
      default: 'sha256',
    })
    .option('-p, --public-key <publicKey>', 'Public key file path (PEM format)')
    .option('-s, --signature <signature>', 'Signature file path (TXT format)')
    .example('contract-js verify contract.pdf -p ./keys/public.pem -s ./keys/signature.txt')
    .example(
      'contract-js verify contract.pdf -a sha256 -p ./keys/public.pem -s ./keys/signature.txt',
    )
    .action(async (ctr, opts) => {
      p.intro(
        color.bgMagenta(color.white(' 🔍 verify ')) +
          color.gray(' - Verify digital signature of PDF contracts'),
      );
      const options = verifyCommandOptionsSchema.parse({
        contractPath: ctr,
        algorithm: opts.algorithm,
        publicKeyPath: opts.publicKey,
        signaturePath: opts.signature,
      });
      const { contractPath, algorithm, publicKeyPath, signaturePath } = options;
      try {
        p.log.step(color.blue('⚙️  Configuration'));
        p.log.info(color.gray(`   📄 Contract: ${color.cyan(contractPath)}`));
        p.log.info(color.gray(`   🔧 Algorithm: ${color.cyan(algorithm.toUpperCase())}`));
        p.log.info(color.gray(`   🔑 Public key: ${color.cyan(publicKeyPath)}`));
        p.log.info(color.gray(`   ✍️ Signature: ${color.cyan(signaturePath)}`));

        p.log.step(color.yellow('📂 Reading contract file...'));
        const fileBuffer = await readFile(contractPath);
        p.log.success(color.green(`✓ Contract file loaded successfully`));
        p.log.info(
          color.gray(`   📏 Size: ${color.white((fileBuffer.length / 1024).toFixed(2))} KB`),
        );

        const publicKey = await readFile(publicKeyPath, 'utf-8');
        p.log.success(color.green(`✓ Public key loaded successfully`));

        const signature = await readFile(signaturePath, 'utf-8');
        p.log.success(color.green(`✓ Signature loaded successfully`));

        // Hash generation
        const { start: hashStart, stop: hashStop } = p.spinner();
        hashStart(color.blue(`🔄 Generating ${color.cyan(algorithm.toUpperCase())} hash...`));
        const pdfHash = getPdfHash(fileBuffer, {
          hashAlgorithm: algorithm,
        });
        hashStop();
        p.log.success(color.green(`✓ Hash generated: ${color.white(pdfHash.substring(0, 16))}...`));

        // Signature verification
        const { start: verifyStart, stop: verifyStop } = p.spinner();
        verifyStart(color.blue('🔍 Verifying digital signature...'));
        const isValid = verifyContractSignature({
          algorithm,
          pdfHash,
          publicKey,
          signature,
        });
        verifyStop();

        if (isValid) {
          p.log.success(color.green(`✨ Signature verification successful!`));
          p.log.info(color.gray(`   📄 Contract: ${color.cyan(contractPath)}`));
          p.log.info(color.gray(`   🔐 Algorithm: ${color.white(algorithm.toUpperCase())}`));
          p.log.info(color.gray(`   🆔 Hash: ${color.white(pdfHash)}`));
          p.log.info(color.gray(`   ✍️ Signature: ${color.white(signature.substring(0, 32))}...`));
          p.log.info(color.gray(`   🔑 Public key: ${color.cyan(publicKeyPath)}`));
          p.log.info(color.gray(`   📝 Signature file: ${color.cyan(signaturePath)}`));
          p.log.info(color.green(`   ✅ Status: ${color.white('VALID')}`));

          p.outro(
            color.green('🎉 Digital signature is valid!') +
              color.gray('\n   💡 The contract has not been tampered with.'),
          );
        } else {
          p.log.error(color.red(`❌ Signature verification failed!`));
          p.log.info(color.gray(`   📄 Contract: ${color.cyan(contractPath)}`));
          p.log.info(color.gray(`   🔐 Algorithm: ${color.white(algorithm.toUpperCase())}`));
          p.log.info(color.gray(`   🆔 Hash: ${color.white(pdfHash)}`));
          p.log.info(color.gray(`   ✍️  Signature: ${color.white(signature.substring(0, 32))}...`));
          p.log.info(color.gray(`   🔑 Public key: ${color.cyan(publicKeyPath)}`));
          p.log.info(color.gray(`   📝 Signature file: ${color.cyan(signaturePath)}`));
          p.log.info(color.red(`   ❌ Status: ${color.white('INVALID')}`));

          p.outro(
            color.red('💥 Digital signature is invalid!') +
              color.gray('\n   ⚠️  The contract may have been tampered with.'),
          );
          process.exit(1);
        }
      } catch (error) {
        p.log.error(
          color.red(
            `💥 Failed to verify signature: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ),
        );
        p.outro(color.red('❌ Process terminated due to error.'));
        process.exit(1);
      }
    });
};
