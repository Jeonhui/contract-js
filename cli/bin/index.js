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
var import_core = require("@contract-js/core");
var import_promises = require("fs/promises");
var import_node_path = require("path");
var import_promises2 = require("fs/promises");
var generateCommandOptionsSchema = import_zod.z.object({
  templatePath: import_zod.z.string().min(1, "Template path is required"),
  outputPath: import_zod.z.string().min(1, "Output path is required"),
  data: import_zod.z.string().optional()
});
var generateCommand = (cli) => {
  cli.command("generate", "Generate contract PDF from EJS template").option("-t, --template <template>", "EJS template file path").option("-o, --output <output>", "Output PDF file path", {
    default: ".temp/contract.pdf"
  }).option("-d, --data <data>", "JSON data file path for template variables").action(async (opts) => {
    try {
      const options = generateCommandOptionsSchema.parse({
        templatePath: opts.template,
        outputPath: opts.output,
        data: opts.data
      });
      let templateData = {};
      if (options.data) {
        console.log(options.data);
        try {
          const dataContent = await (0, import_promises.readFile)(options.data, "utf-8");
          templateData = JSON.parse(dataContent);
        } catch (error) {
          console.warn(
            `Warning: Could not load data file: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
      console.log("Generating contract...");
      console.log(`Template: ${options.templatePath}`);
      console.log(`Output: ${options.outputPath}`);
      await (0, import_promises2.mkdir)((0, import_node_path.dirname)(options.outputPath), { recursive: true });
      const { pdfBuffer, pdfHash } = await (0, import_core.generatePdf)({
        templatePath: options.templatePath,
        templateData
      });
      const fileSize = (pdfBuffer.length / 1024).toFixed(2);
      await (0, import_promises.writeFile)(options.outputPath, pdfBuffer);
      console.log(`\u2705 Contract generated successfully!`);
      console.log(`\u{1F4C4} PDF saved to: ${options.outputPath}`);
      console.log(`\u{1F512} PDF hash: ${pdfHash}`);
      console.log(`\u{1F4CA} File size: ${fileSize} KB`);
      console.log("Done!");
      process.exit(0);
    } catch (error) {
      console.error(
        "\u274C Failed to generate contract:",
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });
};

// src/commands/get-hash.command.ts
var import_zod2 = require("zod");
var import_promises3 = require("fs/promises");
var import_pdf_utils = require("@contract-js/pdf-utils");
var getHashCommandOptionsSchema = import_zod2.z.object({
  filePath: import_zod2.z.string().min(1, "File path is required"),
  algorithm: import_zod2.z.string().optional().default("sha256")
});
var getHashCommand = (cli) => {
  cli.command("hash", "Generate hash for a file").option("-f, --file <file>", "File path to hash").option("-a, --algorithm <algorithm>", "Hash algorithm", {
    default: "sha256"
  }).action(async (opts) => {
    try {
      const options = getHashCommandOptionsSchema.parse({
        filePath: opts.file,
        algorithm: opts.algorithm
      });
      console.log(`Generating ${options.algorithm} hash...`);
      console.log(`File: ${options.filePath}`);
      const fileBuffer = await (0, import_promises3.readFile)(options.filePath);
      const pdfHash = (0, import_pdf_utils.getPdfHash)(fileBuffer, {
        hashAlgorithm: options.algorithm
      });
      console.log(`\u2705 Hash generated successfully!`);
      console.log(`\u{1F510} ${options.algorithm.toUpperCase()}: ${pdfHash}`);
      console.log(`\u{1F4CA} File size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);
    } catch (error) {
      console.error(
        "\u274C Failed to generate hash:",
        error instanceof Error ? error.message : "Unknown error"
      );
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
  getHashCommand(CLI);
  CLI.help();
  CLI.parse();
}
main();
