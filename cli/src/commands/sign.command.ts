import { CAC } from 'cac';
import { z } from 'zod';
import * as p from '@clack/prompts';
import color from 'picocolors';
import { readFile, writeFile } from 'node:fs/promises';
import { mkdir } from 'node:fs/promises';
import { getPdfHash } from '@contract-js/pdf-utils';
import { generateRsaKeyPairSync, signContract } from '@contract-js/crypto';

const signCommandOptionsSchema = z.object({
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
  outputDir: z.string().optional().default('./keys'),
  privateKeyPath: z
    .string()
    .regex(/\.pem$/, {
      message: 'Private key file must be a PEM file with .pem extension.',
    })
    .optional(),
});

export const signCommand = (cli: CAC) => {
  cli
    .command('sign <filePath>', 'Sign a contract PDF file with digital signature')
    .option('-a, --algorithm <algorithm>', 'Hash algorithm', {
      default: 'sha256',
    })
    .option('-o, --output <output>', 'Output directory for keys', {
      default: './keys',
    })
    .option('-k, --key <key>', 'Private key file path (PEM format)')
    .example('contract-js sign contract.pdf')
    .example('contract-js sign contract.pdf -a sha256')
    .example('contract-js sign contract.pdf -o ./keys')
    .example('contract-js sign contract.pdf -k ./keys/private.pem')
    .action(async (ctr, opts) => {
      p.intro(
        color.bgYellow(color.white(' ✍️  sign ')) +
          color.gray(' - Create digital signature for PDF contracts'),
      );
      const options = signCommandOptionsSchema.parse({
        contractPath: ctr,
        algorithm: opts.algorithm,
        outputDir: opts.output,
        privateKeyPath: opts.key,
      });
      const { contractPath, algorithm, outputDir, privateKeyPath } = options;
      try {
        p.log.step(color.yellow('⚙️  Configuration'));
        p.log.info(color.gray(`   📄 Contract: ${color.cyan(contractPath)}`));
        p.log.info(color.gray(`   🔧 Algorithm: ${color.cyan(algorithm.toUpperCase())}`));
        p.log.info(color.gray(`   📁 Keys output: ${color.cyan(outputDir)}`));
        p.log.info(
          color.gray(
            `   🔑 Private key: ${privateKeyPath ? color.cyan(privateKeyPath) : color.yellow('Will generate new key')}`,
          ),
        );
        p.log.step(color.yellow('📂 Reading contract file...'));
        const fileBuffer = await readFile(contractPath);
        p.log.success(color.green(`✓ Contract file loaded successfully`));
        p.log.info(
          color.gray(`   📏 Size: ${color.white((fileBuffer.length / 1024).toFixed(2))} KB`),
        );

        const { start: hashStart, stop: hashStop } = p.spinner();
        hashStart(color.yellow(`🔄 Generating ${color.cyan(algorithm.toUpperCase())} hash...`));
        const pdfHash = getPdfHash(fileBuffer, {
          hashAlgorithm: algorithm,
        });
        hashStop();
        p.log.success(color.green(`✓ Hash generated: ${color.white(pdfHash.substring(0, 16))}...`));

        let publicKey: string;
        let privateKey: string;
        let keyGenerated = false;

        if (privateKeyPath) {
          p.log.step(color.yellow('🔑 Loading existing private key...'));
          try {
            privateKey = await readFile(privateKeyPath, 'utf-8');
            p.log.success(color.green(`✓ Private key loaded from ${color.cyan(privateKeyPath)}`));
            const { start: keyStart, stop: keyStop } = p.spinner();
            keyStart(color.yellow('🔑 Generating public key...'));
            const keyPair = generateRsaKeyPairSync();
            publicKey = keyPair.publicKey;
            keyStop();
            p.log.success(color.green(`✓ Public key generated`));
          } catch (error) {
            p.log.error(
              color.red(
                `❌ Failed to load private key: ${error instanceof Error ? error.message : 'Unknown error'}`,
              ),
            );
            p.log.info(color.yellow('🔄 Falling back to generating new key pair...'));
            const { start: keyStart, stop: keyStop } = p.spinner();
            keyStart(color.yellow('🔑 Generating RSA key pair...'));
            const keyPair = generateRsaKeyPairSync();
            publicKey = keyPair.publicKey;
            privateKey = keyPair.privateKey;
            keyStop();
            keyGenerated = true;
            p.log.success(color.green(`✓ RSA key pair generated`));
          }
        } else {
          const { start: keyStart, stop: keyStop } = p.spinner();
          keyStart(color.yellow('🔑 Generating RSA key pair...'));
          const keyPair = generateRsaKeyPairSync();
          publicKey = keyPair.publicKey;
          privateKey = keyPair.privateKey;
          keyStop();
          keyGenerated = true;
          p.log.success(color.green(`✓ RSA key pair generated`));
        }

        const { start: signStart, stop: signStop } = p.spinner();
        signStart(color.yellow('✍️  Creating digital signature...'));
        const { signature, signedAt } = signContract({
          pdfHash,
          privateKey,
          algorithm,
        });
        signStop();

        let savedPublicKeyPath: string | undefined = undefined;
        let savedPrivateKeyPath: string | undefined = undefined;
        const signaturePath: string = `${outputDir}/signature.txt`;

        if (keyGenerated) {
          p.log.step(color.yellow('💾 Saving keys...'));
          await mkdir(outputDir, { recursive: true });

          savedPublicKeyPath = `${outputDir}/public.pem`;
          savedPrivateKeyPath = `${outputDir}/private.pem`;

          await writeFile(savedPublicKeyPath, publicKey);
          await writeFile(savedPrivateKeyPath, privateKey);
          await writeFile(signaturePath, signature);

          p.log.success(color.green(`✓ Keys and signature saved successfully`));
        } else {
          p.log.step(color.yellow('💾 Saving signature...'));
          await mkdir(outputDir, { recursive: true });
          await writeFile(signaturePath, signature);
          p.log.success(color.green(`✓ Signature saved successfully`));
        }

        p.log.success(color.green(`✨ Contract signed successfully!`));
        p.log.info(color.gray(`   📄 Contract: ${color.cyan(contractPath)}`));
        p.log.info(color.gray(`   🔐 Algorithm: ${color.white(algorithm.toUpperCase())}`));
        p.log.info(color.gray(`   🆔 Hash: ${color.white(pdfHash)}`));
        p.log.info(color.gray(`   ✍️  Signature: ${color.white(signature.substring(0, 32))}...`));
        p.log.info(color.gray(`   🕐 Signed at: ${color.white(signedAt.toISOString())}`));
        p.log.info(color.gray(`   📁 Output directory: ${color.cyan(outputDir)}`));
        if (keyGenerated) {
          p.log.info(color.gray(`   🔑 Public key: ${color.cyan(savedPublicKeyPath!)}`));
          p.log.info(color.gray(`   🔐 Private key: ${color.cyan(savedPrivateKeyPath!)}`));
        } else {
          p.log.info(color.gray(`   🔑 Private key (provided): ${color.cyan(privateKeyPath!)} `));
        }
        p.log.info(color.gray(`   ✍️  Signature: ${color.cyan(signaturePath!)}`));
        p.outro(color.green('🎉 Digital signature created successfully!'));
        process.exit(0);
      } catch (error) {
        p.log.error(
          color.red(
            `💥 Failed to sign contract: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ),
        );
        p.outro(color.red('❌ Process terminated due to error.'));
        process.exit(1);
      }
    });
};
