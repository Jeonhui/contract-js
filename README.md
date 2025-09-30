[//]: # (contract-js - PDF Contract Generation with Digital Signatures)

<div align="center">

# 📄 contract-js

**PDF Contract Generation with Digital Signatures**

*A comprehensive TypeScript library for generating PDF contracts from EJS templates with digital signature support and metadata management.*

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-orange?style=flat-square&logo=pnpm)](https://pnpm.io/)

</div>

---

## 🎯 Purpose

Generate professional PDF contracts from EJS templates with complete digital signature workflow including key generation, signing, verification, and comprehensive metadata management.

## ⌨️ CLI

### `@contract-js/cli`

[![npm version](https://img.shields.io/npm/v/@contract-js/cli?style=flat-square)](https://www.npmjs.com/package/@contract-js/cli)

**Command Line Interface for Contract Generation**

A powerful CLI tool for generating PDF contracts from EJS templates with complete digital signature workflow and metadata management.

- **Contract Generation** – Generate PDF contracts from EJS templates with customizable metadata
- **Digital Signing** – Create digital signatures for PDF contracts
- **Signature Verification** – Verify digital signatures against PDF hashes
- **File Hashing** – Generate cryptographic hashes for files
- **Metadata Extraction** – Extract and display PDF metadata information
- **Template Support** – Support for EJS templates with dynamic data
- **JSON Data Loading** – Load template data from JSON files
- **Key Management** – Generate and manage RSA key pairs
- **Output Management** – Flexible output directory and file naming

## 📦 Packages

### `@contract-js/core`

[![npm version](https://img.shields.io/npm/v/@contract-js/core?style=flat-square)](https://www.npmjs.com/package/@contract-js/core)

**PDF Contract Generation from EJS Templates**

Core functionality for generating PDF contracts from EJS templates with modular template loading, PDF generation, and metadata management.

- **Template Loading** – Load EJS templates from file system with flexible options
- **PDF Generation** – Convert EJS templates to PDF documents with configurable options
- **Template Rendering** – Render EJS templates with dynamic data and utility functions
- **PDF Configuration** – Customize PDF format, margins, metadata, and background printing
- **Metadata Management** – Set and extract PDF metadata (title, author, creator, producer, etc.)
- **Hash Generation** – Generate cryptographic hashes for PDF documents

### `@contract-js/crypto`

[![npm version](https://img.shields.io/npm/v/@contract-js/crypto?style=flat-square)](https://www.npmjs.com/package/@contract-js/crypto)

**Digital Signature Generation and Verification**

Cryptographic utilities for digital signature generation and verification.

- **RSA Key Generation** – Generate RSA key pairs for digital signatures
- **Digital Signing** – Create digital signatures for PDF contracts
- **Signature Verification** – Verify digital signatures against PDF hashes

### `@contract-js/pdf-utils`

[![npm version](https://img.shields.io/npm/v/@contract-js/pdf-utils?style=flat-square)](https://www.npmjs.com/package/@contract-js/pdf-utils)

**PDF Hash Generation and Comparison**

Utility functions for PDF hash generation and comparison.

- **PDF Hashing** – Generate cryptographic hashes for PDF documents
- **Hash Comparison** – Compare PDF hashes to detect changes
- **Buffer Conversion** – Convert PDF hashes to buffers for cryptographic operations

## 🚀 Quick Start

### CLI Usage

```bash
# Install CLI globally
npm install -g @contract-js/cli

# Generate PDF contract from EJS template
contract-js generate template.ejs -d data.json -o contract.pdf

# Extract PDF metadata
contract-js metadata contract.pdf

# Generate file hash
contract-js hash contract.pdf

# Sign contract with digital signature
contract-js sign contract.pdf -o ./keys

# Verify digital signature
contract-js verify contract.pdf -p ./keys/public.pem -s ./keys/signature.txt

# Show help
contract-js --help

# Show version
contract-js --version
```

#### CLI Commands

| Command | Description | Options |
|---------|-------------|---------|
| `generate <template>` | Generate PDF from EJS template | `-d, --data <path>` - JSON data file path<br>`-o, --output <path>` - Output PDF file path |
| `metadata <filePath>` | Extract PDF metadata | None |
| `hash <filePath>` | Generate file hash | `-a, --algorithm <algo>` - Hash algorithm (default: sha256) |
| `sign <filePath>` | Sign PDF with digital signature | `-a, --algorithm <algo>` - Hash algorithm<br>`-o, --output <dir>` - Keys output directory<br>`-k, --key <path>` - Private key file path |
| `verify <filePath>` | Verify digital signature | `-a, --algorithm <algo>` - Hash algorithm<br>`-p, --public-key <path>` - Public key file path<br>`-s, --signature <path>` - Signature file path |

### Programmatic Usage

```typescript
import { loadTemplate, generatePdf, getPdfMetadata } from '@contract-js/core';
import { signContract, verifyContractSignature } from '@contract-js/crypto';

// Load EJS template
const templateContent = await loadTemplate({
  templatePath: './template.ejs',
});

// Generate PDF from template with metadata
const result = await generatePdf({
  templateContent,
  templateData: { 
    title: 'Service Agreement',
    clientName: 'John Doe',
    amount: 5000,
    date: new Date(),
  },
  pdfConfig: {
    options: {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    },
    metadata: {
      title: 'Service Agreement',
      author: 'ABC Corp',
      creator: 'Contract-JS Generator',
      producer: 'Contract-JS PDF Engine',
      keywords: ['contract', 'agreement', 'service'],
    },
  },
});

// Extract PDF metadata
const metadata = await getPdfMetadata(result.pdfBuffer);
console.log('PDF Metadata:', metadata);

// Sign PDF
const signature = await signContract({
  pdfHash: result.pdfHash,
  privateKey: privateKeyPem,
  algorithm: 'sha256'
});

// Verify signature
const isValid = verifyContractSignature({
  algorithm: 'sha256',
  pdfHash: result.pdfHash,
  publicKey: publicKeyPem,
  signature: signature.signature
});
```

## 📦 Installation

```bash
# Install CLI package
npm install @contract-js/cli

# Install all packages
npm install @contract-js/core @contract-js/crypto @contract-js/pdf-utils

# Or install individually
npm install @contract-js/core
npm install @contract-js/crypto
npm install @contract-js/pdf-utils
```

## 🔧 Development

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Setup

```bash
# Clone repository
git clone https://github.com/Jeonhui/contract-js.git
cd contract-js

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Link CLI for local development
pnpm cli:link
```

### Available Scripts

```bash
# Build all packages
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm check-types

# Clean build artifacts
pnpm clean

# CLI development
pnpm cli:build    # Build CLI
pnpm cli:link      # Link CLI globally
pnpm cli:unlink    # Unlink CLI globally
```

## ⚙️ Tech Stack

| Tool                  | Purpose                                     |
|-----------------------|---------------------------------------------|
| **pnpm + Turbo**      | Monorepo workspace management               |
| **tsup**              | Bundling ESM/CJS with type declarations     |
| **TypeScript**        | Language with strict settings               |
| **ESLint + Prettier** | Code linting and formatting                 |
| **Puppeteer**         | HTML to PDF conversion                      |
| **pdf-lib**           | PDF manipulation and metadata management   |
| **EJS**               | Template engine                             |
| **CAC**               | CLI framework for command parsing           |
| **@clack/prompts**    | Interactive CLI prompts and UI              |
| **Zod**               | Schema validation for CLI commands          |

## 🏗️ Architecture

```
contract-js/
├── packages/
│   ├── core/           # PDF generation and template rendering
│   ├── crypto/         # Digital signature generation and verification
│   └── pdf-utils/      # PDF hash utilities
├── cli/               # Command-line interface
└── README.md          # This file
```

### Package Dependencies

- **CLI** depends on all packages (`core`, `crypto`, `pdf-utils`)
- **Core** depends on `pdf-utils` for hash generation
- **Crypto** is independent
- **PDF-utils** is independent

## 📋 Features Overview

### PDF Generation
- ✅ EJS template rendering
- ✅ Customizable PDF options (format, margins, etc.)
- ✅ PDF metadata management
- ✅ Background printing support
- ✅ Multiple page formats (A4, Letter, etc.)

### Digital Signatures
- ✅ RSA key pair generation
- ✅ PDF hash generation
- ✅ Digital signature creation
- ✅ Signature verification
- ✅ Multiple hash algorithms (SHA1, SHA256, SHA384, SHA512)

### CLI Interface
- ✅ Interactive command-line interface
- ✅ Beautiful terminal UI with colors and emojis
- ✅ Comprehensive error handling
- ✅ Input validation with Zod schemas
- ✅ Progress indicators and spinners

### Metadata Management
- ✅ PDF metadata extraction
- ✅ Metadata setting during PDF generation
- ✅ Support for all standard PDF metadata fields
- ✅ Date handling for creation and modification dates

---

## 📝 License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Copyright © [Jeonhui](https://github.com/Jeonhui)