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
var import_core = require("@contract-js/core");
var import_zod = require("zod");
var generateCommandOptionsSchema = import_zod.z.object({
  templatePath: import_zod.z.string().nonempty(),
  outputPath: import_zod.z.string().nonempty()
});
var generateCommand = (cli) => {
  cli.command("generate", "generate contract").option("-t, --template <template>", "Template file path").option("-o, --output <output>", "Output file path", {
    default: "./output.pdf"
  }).action(async (opts) => {
    const options = generateCommandOptionsSchema.parse({
      templatePath: opts.template,
      outputPath: opts.output
    });
    const contract = new import_core.Contract({
      templatePath: options.templatePath
    });
    await contract.generate();
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
  CLI.help();
  CLI.parse();
}
main();
