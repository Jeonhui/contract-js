#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_cac = require("cac");

// src/utils/get-package-json.ts
var import_findup_sync = __toESM(require("findup-sync"));
var import_fs = require("fs");
var getPackageJson = () => {
  const pkgPath = (0, import_findup_sync.default)("package.json");
  if (!pkgPath)
    throw new Error(
      "Could not locate a package.json file. Make sure you're running this command inside a Node.js project."
    );
  try {
    return JSON.parse((0, import_fs.readFileSync)(pkgPath, "utf-8"));
  } catch (err) {
    throw new Error(`Failed to read or parse package.json: ${err.message}`);
  }
};

// src/commands/generate.command.ts
var import_zod = require("zod");
var p = __toESM(require("@clack/prompts"));
var import_picocolors = __toESM(require("picocolors"));
var import_core = require("@contract-js/core");
var import_promises = require("fs/promises");
var import_node_path = require("path");
var import_promises2 = require("fs/promises");
var generateCommandOptionsSchema = import_zod.z.object({
  templatePath: import_zod.z.string().regex(/\.ejs$/, {
    message: "Template file must be an EJS file with .ejs extension."
  }).nonempty("Template file path is required"),
  templateDataPath: import_zod.z.string().regex(/\.json$/, {
    message: "Template data file must be a JSON file with .json extension."
  }).optional(),
  outputPath: import_zod.z.string().regex(/\.pdf$/, {
    message: "Output file must be a PDF file with .pdf extension."
  }).nonempty("Output file path is required").default("contract.pdf")
});
var generateCommand = (cli) => {
  cli.command("generate <template>", "Generate contract PDF from EJS template").option("-d, --data <data>", "JSON data file path for template variables (JSON format)").option("-o, --output <output>", "Output PDF file path (PDF format)").example("contract-js generate template.ejs").example("contract-js generate template.ejs -d data.json").example("contract-js generate template.ejs -d data.json -o contract.pdf").action(async (tmp, opts) => {
    p.intro(
      import_picocolors.default.bgBlue(import_picocolors.default.white(" \u{1F4C4} generate")) + import_picocolors.default.gray(" - Generate beautiful PDF contracts from EJS templates")
    );
    const options = generateCommandOptionsSchema.parse({
      templatePath: tmp,
      templateDataPath: opts.data,
      outputPath: opts.output
    });
    const { templatePath, templateDataPath, outputPath } = options;
    let templateData = {};
    if (templateDataPath) {
      try {
        p.log.step(import_picocolors.default.yellow("\u{1F4C2} Loading template data..."));
        const dataContent = await (0, import_promises.readFile)(templateDataPath, "utf-8");
        templateData = JSON.parse(dataContent);
        p.log.success(import_picocolors.default.green(`\u2713 Loaded data from ${import_picocolors.default.cyan(templateDataPath)}`));
      } catch (error) {
        p.log.error(
          import_picocolors.default.red(
            `\u274C Could not read template data file: ${error instanceof Error ? error.message : "Unknown error"}`
          )
        );
        p.outro(import_picocolors.default.red("\u{1F4A5} Exiting due to error..."));
        process.exit(1);
      }
    } else {
      p.log.info(import_picocolors.default.yellow("\u2139\uFE0F  No template data provided, using empty object"));
    }
    const { start, stop } = p.spinner();
    try {
      const outputFile = outputPath.split("/").pop() || "contract.pdf";
      p.log.step(import_picocolors.default.blue("\u2699\uFE0F  Configuration"));
      p.log.info(import_picocolors.default.gray(`   \u{1F4C4} Template: ${import_picocolors.default.cyan(templatePath)}`));
      p.log.info(import_picocolors.default.gray(`   \u{1F4DD} Output: ${import_picocolors.default.cyan(outputPath)}`));
      p.log.info(
        import_picocolors.default.gray(
          `   \u{1F4CA} Data: ${Object.keys(templateData).length > 0 ? import_picocolors.default.green(`${Object.keys(templateData).length} properties`) : import_picocolors.default.yellow("No data provided")}`
        )
      );
      if (Object.keys(templateData).length > 0) {
        p.log.info(import_picocolors.default.gray("   \u{1F4CB} Template variables:"));
        Object.entries(templateData).forEach(([key, value]) => {
          const valueStr = typeof value === "object" ? JSON.stringify(value) : String(value);
          const truncatedValue = valueStr.length > 50 ? valueStr.substring(0, 47) + "..." : valueStr;
          p.log.info(import_picocolors.default.gray(`      ${import_picocolors.default.cyan(key)}: ${import_picocolors.default.white(truncatedValue)}`));
        });
      }
      await (0, import_promises2.mkdir)((0, import_node_path.dirname)(outputPath), { recursive: true });
      start(import_picocolors.default.blue(`\u{1F504} Generating ${import_picocolors.default.cyan(outputFile)}...`));
      const { pdfBuffer, pdfHash, pdfKB } = await (0, import_core.generatePdf)({
        templatePath,
        templateData
      });
      await (0, import_promises.writeFile)(outputPath, pdfBuffer);
      stop();
      p.log.success(import_picocolors.default.green(`\u2728 Contract generated successfully!`));
      p.log.info(import_picocolors.default.gray(`   \u{1F4C4} File: ${import_picocolors.default.cyan(outputFile)}`));
      p.log.info(import_picocolors.default.gray(`   \u{1F4CF} Size: ${import_picocolors.default.white(pdfKB.toFixed(2))} KB`));
      p.log.info(import_picocolors.default.gray(`   \u{1F510} Hash: ${import_picocolors.default.white(pdfHash)}`));
      p.log.info(import_picocolors.default.gray(`   \u{1F4CD} Path: ${import_picocolors.default.cyan(outputPath)}`));
      p.outro(import_picocolors.default.green("\u{1F389} All done! Your contract is ready to use."));
      process.exit(0);
    } catch (error) {
      stop();
      p.log.error(
        import_picocolors.default.red(
          `\u{1F4A5} Failed to generate contract: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      p.outro(import_picocolors.default.red("\u274C Process terminated due to error."));
      process.exit(1);
    }
  });
};

// src/commands/hash.command.ts
var import_zod2 = require("zod");
var p2 = __toESM(require("@clack/prompts"));
var import_picocolors2 = __toESM(require("picocolors"));
var import_promises3 = require("fs/promises");
var import_pdf_utils = require("@contract-js/pdf-utils");
var hashCommandOptionsSchema = import_zod2.z.object({
  contractPath: import_zod2.z.string().regex(/\.pdf$/, {
    message: "Contract file must be a PDF file with .pdf extension."
  }).nonempty("Contract file path is required"),
  algorithm: import_zod2.z.string().optional().default("sha256").refine((val) => ["sha1", "sha256", "sha384", "sha512"].includes(val), {
    message: "Algorithm must be one of: sha1, sha256, sha384, sha512"
  })
});
var hashCommand = (cli) => {
  cli.command("hash <filePath>", "Get hash from a contract PDF file").option("-a, --algorithm <algorithm>", "Hash algorithm", {
    default: "sha256"
  }).example("contract-js hash contract.pdf").example("contract-js hash contract.pdf -a sha256").action(async (ctr, opts) => {
    p2.intro(
      import_picocolors2.default.bgGreen(import_picocolors2.default.white(" \u{1F510} hash ")) + import_picocolors2.default.gray(" - get cryptographic hash from PDF files")
    );
    const options = hashCommandOptionsSchema.parse({
      contractPath: ctr,
      algorithm: opts.algorithm
    });
    const { contractPath, algorithm } = options;
    try {
      p2.log.step(import_picocolors2.default.blue("\u2699\uFE0F  Configuration"));
      p2.log.info(import_picocolors2.default.gray(`   \u{1F4C4} File: ${import_picocolors2.default.cyan(contractPath)}`));
      p2.log.info(import_picocolors2.default.gray(`   \u{1F527} Algorithm: ${import_picocolors2.default.cyan(algorithm.toUpperCase())}`));
      p2.log.step(import_picocolors2.default.yellow("\u{1F4C2} Reading contract file..."));
      const fileBuffer = await (0, import_promises3.readFile)(contractPath);
      p2.log.success(import_picocolors2.default.green(`\u2713 File loaded successfully`));
      p2.log.info(
        import_picocolors2.default.gray(`   \u{1F4CF} Size: ${import_picocolors2.default.white((fileBuffer.length / 1024).toFixed(2))} KB`)
      );
      const { start, stop } = p2.spinner();
      start(import_picocolors2.default.green(`\u{1F504} Getting ${import_picocolors2.default.cyan(options.algorithm.toUpperCase())} hash...`));
      const pdfHash = (0, import_pdf_utils.getPdfHash)(fileBuffer, {
        hashAlgorithm: options.algorithm
      });
      stop();
      p2.log.success(import_picocolors2.default.green(`\u2728 Hash generated successfully!`));
      p2.log.info(import_picocolors2.default.gray(`   \u{1F510} Algorithm: ${import_picocolors2.default.white(options.algorithm.toUpperCase())}`));
      p2.log.info(import_picocolors2.default.gray(`   \u{1F194} Hash: ${import_picocolors2.default.white(pdfHash)}`));
      p2.log.info(import_picocolors2.default.gray(`   \u{1F4C4} File: ${import_picocolors2.default.cyan(contractPath)}`));
      p2.log.info(
        import_picocolors2.default.gray(`   \u{1F4CF} Size: ${import_picocolors2.default.white((fileBuffer.length / 1024).toFixed(2))} KB`)
      );
      p2.outro(import_picocolors2.default.green("\u{1F389} Hash generation completed!"));
      process.exit(0);
    } catch (error) {
      p2.log.error(
        import_picocolors2.default.red(
          `\u{1F4A5} Failed to generate hash: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      p2.outro(import_picocolors2.default.red("\u274C Process terminated due to error."));
      process.exit(1);
    }
  });
};

// src/commands/sign.command.ts
var import_zod3 = require("zod");
var p3 = __toESM(require("@clack/prompts"));
var import_picocolors3 = __toESM(require("picocolors"));
var import_promises4 = require("fs/promises");
var import_promises5 = require("fs/promises");
var import_pdf_utils2 = require("@contract-js/pdf-utils");
var import_crypto = require("@contract-js/crypto");
var signCommandOptionsSchema = import_zod3.z.object({
  contractPath: import_zod3.z.string().regex(/\.pdf$/, {
    message: "Contract file must be a PDF file with .pdf extension."
  }).nonempty("Contract file path is required"),
  algorithm: import_zod3.z.string().optional().default("sha256").refine((val) => ["sha1", "sha256", "sha384", "sha512"].includes(val), {
    message: "Algorithm must be one of: sha1, sha256, sha384, sha512"
  }),
  outputDir: import_zod3.z.string().optional().default("./keys"),
  privateKeyPath: import_zod3.z.string().regex(/\.pem$/, {
    message: "Private key file must be a PEM file with .pem extension."
  }).optional()
});
var signCommand = (cli) => {
  cli.command("sign <filePath>", "Sign a contract PDF file with digital signature").option("-a, --algorithm <algorithm>", "Hash algorithm", {
    default: "sha256"
  }).option("-o, --output <output>", "Output directory for keys", {
    default: "./keys"
  }).option("-k, --key <key>", "Private key file path (PEM format)").example("contract-js sign contract.pdf").example("contract-js sign contract.pdf -a sha256").example("contract-js sign contract.pdf -o ./keys").example("contract-js sign contract.pdf -k ./keys/private.pem").action(async (ctr, opts) => {
    p3.intro(
      import_picocolors3.default.bgYellow(import_picocolors3.default.white(" \u270D\uFE0F  sign ")) + import_picocolors3.default.gray(" - Create digital signature for PDF contracts")
    );
    const options = signCommandOptionsSchema.parse({
      contractPath: ctr,
      algorithm: opts.algorithm,
      outputDir: opts.output,
      privateKeyPath: opts.key
    });
    const { contractPath, algorithm, outputDir, privateKeyPath } = options;
    try {
      p3.log.step(import_picocolors3.default.yellow("\u2699\uFE0F  Configuration"));
      p3.log.info(import_picocolors3.default.gray(`   \u{1F4C4} Contract: ${import_picocolors3.default.cyan(contractPath)}`));
      p3.log.info(import_picocolors3.default.gray(`   \u{1F527} Algorithm: ${import_picocolors3.default.cyan(algorithm.toUpperCase())}`));
      p3.log.info(import_picocolors3.default.gray(`   \u{1F4C1} Keys output: ${import_picocolors3.default.cyan(outputDir)}`));
      p3.log.info(
        import_picocolors3.default.gray(
          `   \u{1F511} Private key: ${privateKeyPath ? import_picocolors3.default.cyan(privateKeyPath) : import_picocolors3.default.yellow("Will generate new key")}`
        )
      );
      p3.log.step(import_picocolors3.default.yellow("\u{1F4C2} Reading contract file..."));
      const fileBuffer = await (0, import_promises4.readFile)(contractPath);
      p3.log.success(import_picocolors3.default.green(`\u2713 Contract file loaded successfully`));
      p3.log.info(
        import_picocolors3.default.gray(`   \u{1F4CF} Size: ${import_picocolors3.default.white((fileBuffer.length / 1024).toFixed(2))} KB`)
      );
      const { start: hashStart, stop: hashStop } = p3.spinner();
      hashStart(import_picocolors3.default.yellow(`\u{1F504} Generating ${import_picocolors3.default.cyan(algorithm.toUpperCase())} hash...`));
      const pdfHash = (0, import_pdf_utils2.getPdfHash)(fileBuffer, {
        hashAlgorithm: algorithm
      });
      hashStop();
      p3.log.success(import_picocolors3.default.green(`\u2713 Hash generated: ${import_picocolors3.default.white(pdfHash.substring(0, 16))}...`));
      let publicKey;
      let privateKey;
      let keyGenerated = false;
      if (privateKeyPath) {
        p3.log.step(import_picocolors3.default.yellow("\u{1F511} Loading existing private key..."));
        try {
          privateKey = await (0, import_promises4.readFile)(privateKeyPath, "utf-8");
          p3.log.success(import_picocolors3.default.green(`\u2713 Private key loaded from ${import_picocolors3.default.cyan(privateKeyPath)}`));
          const { start: keyStart, stop: keyStop } = p3.spinner();
          keyStart(import_picocolors3.default.yellow("\u{1F511} Generating public key..."));
          const keyPair = (0, import_crypto.generateRsaKeyPairSync)();
          publicKey = keyPair.publicKey;
          keyStop();
          p3.log.success(import_picocolors3.default.green(`\u2713 Public key generated`));
        } catch (error) {
          p3.log.error(
            import_picocolors3.default.red(
              `\u274C Failed to load private key: ${error instanceof Error ? error.message : "Unknown error"}`
            )
          );
          p3.log.info(import_picocolors3.default.yellow("\u{1F504} Falling back to generating new key pair..."));
          const { start: keyStart, stop: keyStop } = p3.spinner();
          keyStart(import_picocolors3.default.yellow("\u{1F511} Generating RSA key pair..."));
          const keyPair = (0, import_crypto.generateRsaKeyPairSync)();
          publicKey = keyPair.publicKey;
          privateKey = keyPair.privateKey;
          keyStop();
          keyGenerated = true;
          p3.log.success(import_picocolors3.default.green(`\u2713 RSA key pair generated`));
        }
      } else {
        const { start: keyStart, stop: keyStop } = p3.spinner();
        keyStart(import_picocolors3.default.yellow("\u{1F511} Generating RSA key pair..."));
        const keyPair = (0, import_crypto.generateRsaKeyPairSync)();
        publicKey = keyPair.publicKey;
        privateKey = keyPair.privateKey;
        keyStop();
        keyGenerated = true;
        p3.log.success(import_picocolors3.default.green(`\u2713 RSA key pair generated`));
      }
      const { start: signStart, stop: signStop } = p3.spinner();
      signStart(import_picocolors3.default.yellow("\u270D\uFE0F  Creating digital signature..."));
      const { signature, signedAt } = (0, import_crypto.signContract)({
        pdfHash,
        privateKey,
        algorithm
      });
      signStop();
      let savedPublicKeyPath = void 0;
      let savedPrivateKeyPath = void 0;
      const signaturePath = `${outputDir}/signature.txt`;
      if (keyGenerated) {
        p3.log.step(import_picocolors3.default.yellow("\u{1F4BE} Saving keys..."));
        await (0, import_promises5.mkdir)(outputDir, { recursive: true });
        savedPublicKeyPath = `${outputDir}/public.pem`;
        savedPrivateKeyPath = `${outputDir}/private.pem`;
        await (0, import_promises4.writeFile)(savedPublicKeyPath, publicKey);
        await (0, import_promises4.writeFile)(savedPrivateKeyPath, privateKey);
        await (0, import_promises4.writeFile)(signaturePath, signature);
        p3.log.success(import_picocolors3.default.green(`\u2713 Keys and signature saved successfully`));
      } else {
        p3.log.step(import_picocolors3.default.yellow("\u{1F4BE} Saving signature..."));
        await (0, import_promises5.mkdir)(outputDir, { recursive: true });
        await (0, import_promises4.writeFile)(signaturePath, signature);
        p3.log.success(import_picocolors3.default.green(`\u2713 Signature saved successfully`));
      }
      p3.log.success(import_picocolors3.default.green(`\u2728 Contract signed successfully!`));
      p3.log.info(import_picocolors3.default.gray(`   \u{1F4C4} Contract: ${import_picocolors3.default.cyan(contractPath)}`));
      p3.log.info(import_picocolors3.default.gray(`   \u{1F510} Algorithm: ${import_picocolors3.default.white(algorithm.toUpperCase())}`));
      p3.log.info(import_picocolors3.default.gray(`   \u{1F194} Hash: ${import_picocolors3.default.white(pdfHash)}`));
      p3.log.info(import_picocolors3.default.gray(`   \u270D\uFE0F  Signature: ${import_picocolors3.default.white(signature.substring(0, 32))}...`));
      p3.log.info(import_picocolors3.default.gray(`   \u{1F550} Signed at: ${import_picocolors3.default.white(signedAt.toISOString())}`));
      p3.log.info(import_picocolors3.default.gray(`   \u{1F4C1} Output directory: ${import_picocolors3.default.cyan(outputDir)}`));
      if (keyGenerated) {
        p3.log.info(import_picocolors3.default.gray(`   \u{1F511} Public key: ${import_picocolors3.default.cyan(savedPublicKeyPath)}`));
        p3.log.info(import_picocolors3.default.gray(`   \u{1F510} Private key: ${import_picocolors3.default.cyan(savedPrivateKeyPath)}`));
      } else {
        p3.log.info(import_picocolors3.default.gray(`   \u{1F511} Private key (provided): ${import_picocolors3.default.cyan(privateKeyPath)} `));
      }
      p3.log.info(import_picocolors3.default.gray(`   \u270D\uFE0F  Signature: ${import_picocolors3.default.cyan(signaturePath)}`));
      p3.outro(import_picocolors3.default.green("\u{1F389} Digital signature created successfully!"));
      process.exit(0);
    } catch (error) {
      p3.log.error(
        import_picocolors3.default.red(
          `\u{1F4A5} Failed to sign contract: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      p3.outro(import_picocolors3.default.red("\u274C Process terminated due to error."));
      process.exit(1);
    }
  });
};

// src/commands/verify.command.ts
var import_zod4 = require("zod");
var p4 = __toESM(require("@clack/prompts"));
var import_picocolors4 = __toESM(require("picocolors"));
var import_promises6 = require("fs/promises");
var import_pdf_utils3 = require("@contract-js/pdf-utils");
var import_crypto2 = require("@contract-js/crypto");
var verifyCommandOptionsSchema = import_zod4.z.object({
  contractPath: import_zod4.z.string().regex(/\.pdf$/, {
    message: "Contract file must be a PDF file with .pdf extension."
  }).nonempty("Contract file path is required"),
  algorithm: import_zod4.z.string().optional().default("sha256").refine((val) => ["sha1", "sha256", "sha384", "sha512"].includes(val), {
    message: "Algorithm must be one of: sha1, sha256, sha384, sha512"
  }),
  publicKeyPath: import_zod4.z.string().regex(/\.pem$/, {
    message: "Public key file must be a PEM file with .pem extension."
  }).nonempty("Public key file path is required"),
  signaturePath: import_zod4.z.string().regex(/\.txt$/, {
    message: "Signature file must be a text file with .txt extension."
  }).nonempty("Signature file path is required")
});
var verifyCommand = (cli) => {
  cli.command("verify <filePath>", "Verify digital signature of a contract PDF file").option("-a, --algorithm <algorithm>", "Hash algorithm", {
    default: "sha256"
  }).option("-p, --public-key <publicKey>", "Public key file path (PEM format)").option("-s, --signature <signature>", "Signature file path (TXT format)").example("contract-js verify contract.pdf -p ./keys/public.pem -s ./keys/signature.txt").example(
    "contract-js verify contract.pdf -a sha256 -p ./keys/public.pem -s ./keys/signature.txt"
  ).action(async (ctr, opts) => {
    p4.intro(
      import_picocolors4.default.bgMagenta(import_picocolors4.default.white(" \u{1F50D} verify ")) + import_picocolors4.default.gray(" - Verify digital signature of PDF contracts")
    );
    const options = verifyCommandOptionsSchema.parse({
      contractPath: ctr,
      algorithm: opts.algorithm,
      publicKeyPath: opts.publicKey,
      signaturePath: opts.signature
    });
    const { contractPath, algorithm, publicKeyPath, signaturePath } = options;
    try {
      p4.log.step(import_picocolors4.default.blue("\u2699\uFE0F  Configuration"));
      p4.log.info(import_picocolors4.default.gray(`   \u{1F4C4} Contract: ${import_picocolors4.default.cyan(contractPath)}`));
      p4.log.info(import_picocolors4.default.gray(`   \u{1F527} Algorithm: ${import_picocolors4.default.cyan(algorithm.toUpperCase())}`));
      p4.log.info(import_picocolors4.default.gray(`   \u{1F511} Public key: ${import_picocolors4.default.cyan(publicKeyPath)}`));
      p4.log.info(import_picocolors4.default.gray(`   \u270D\uFE0F Signature: ${import_picocolors4.default.cyan(signaturePath)}`));
      p4.log.step(import_picocolors4.default.yellow("\u{1F4C2} Reading contract file..."));
      const fileBuffer = await (0, import_promises6.readFile)(contractPath);
      p4.log.success(import_picocolors4.default.green(`\u2713 Contract file loaded successfully`));
      p4.log.info(
        import_picocolors4.default.gray(`   \u{1F4CF} Size: ${import_picocolors4.default.white((fileBuffer.length / 1024).toFixed(2))} KB`)
      );
      const publicKey = await (0, import_promises6.readFile)(publicKeyPath, "utf-8");
      p4.log.success(import_picocolors4.default.green(`\u2713 Public key loaded successfully`));
      const signature = await (0, import_promises6.readFile)(signaturePath, "utf-8");
      p4.log.success(import_picocolors4.default.green(`\u2713 Signature loaded successfully`));
      const { start: hashStart, stop: hashStop } = p4.spinner();
      hashStart(import_picocolors4.default.blue(`\u{1F504} Generating ${import_picocolors4.default.cyan(algorithm.toUpperCase())} hash...`));
      const pdfHash = (0, import_pdf_utils3.getPdfHash)(fileBuffer, {
        hashAlgorithm: algorithm
      });
      hashStop();
      p4.log.success(import_picocolors4.default.green(`\u2713 Hash generated: ${import_picocolors4.default.white(pdfHash.substring(0, 16))}...`));
      const { start: verifyStart, stop: verifyStop } = p4.spinner();
      verifyStart(import_picocolors4.default.blue("\u{1F50D} Verifying digital signature..."));
      const isValid = (0, import_crypto2.verifyContractSignature)({
        algorithm,
        pdfHash,
        publicKey,
        signature
      });
      verifyStop();
      if (isValid) {
        p4.log.success(import_picocolors4.default.green(`\u2728 Signature verification successful!`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F4C4} Contract: ${import_picocolors4.default.cyan(contractPath)}`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F510} Algorithm: ${import_picocolors4.default.white(algorithm.toUpperCase())}`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F194} Hash: ${import_picocolors4.default.white(pdfHash)}`));
        p4.log.info(import_picocolors4.default.gray(`   \u270D\uFE0F Signature: ${import_picocolors4.default.white(signature.substring(0, 32))}...`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F511} Public key: ${import_picocolors4.default.cyan(publicKeyPath)}`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F4DD} Signature file: ${import_picocolors4.default.cyan(signaturePath)}`));
        p4.log.info(import_picocolors4.default.green(`   \u2705 Status: ${import_picocolors4.default.white("VALID")}`));
        p4.outro(
          import_picocolors4.default.green("\u{1F389} Digital signature is valid!") + import_picocolors4.default.gray("\n   \u{1F4A1} The contract has not been tampered with.")
        );
      } else {
        p4.log.error(import_picocolors4.default.red(`\u274C Signature verification failed!`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F4C4} Contract: ${import_picocolors4.default.cyan(contractPath)}`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F510} Algorithm: ${import_picocolors4.default.white(algorithm.toUpperCase())}`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F194} Hash: ${import_picocolors4.default.white(pdfHash)}`));
        p4.log.info(import_picocolors4.default.gray(`   \u270D\uFE0F  Signature: ${import_picocolors4.default.white(signature.substring(0, 32))}...`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F511} Public key: ${import_picocolors4.default.cyan(publicKeyPath)}`));
        p4.log.info(import_picocolors4.default.gray(`   \u{1F4DD} Signature file: ${import_picocolors4.default.cyan(signaturePath)}`));
        p4.log.info(import_picocolors4.default.red(`   \u274C Status: ${import_picocolors4.default.white("INVALID")}`));
        p4.outro(
          import_picocolors4.default.red("\u{1F4A5} Digital signature is invalid!") + import_picocolors4.default.gray("\n   \u26A0\uFE0F  The contract may have been tampered with.")
        );
        process.exit(1);
      }
    } catch (error) {
      p4.log.error(
        import_picocolors4.default.red(
          `\u{1F4A5} Failed to verify signature: ${error instanceof Error ? error.message : "Unknown error"}`
        )
      );
      p4.outro(import_picocolors4.default.red("\u274C Process terminated due to error."));
      process.exit(1);
    }
  });
};

// src/index.ts
async function main() {
  const packageJson = getPackageJson();
  const packageName = packageJson.name || "contract-js";
  const packageVersion = packageJson.version || "1.0.0";
  const CLI = (0, import_cac.cac)(packageName);
  CLI.version(packageVersion, "-v, --version");
  generateCommand(CLI);
  hashCommand(CLI);
  signCommand(CLI);
  verifyCommand(CLI);
  CLI.help();
  CLI.parse();
}
main();
