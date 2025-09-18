[//]: # (contract-js - PDF Contract Generation with Digital Signatures)

<div align="center">

# 📄 contract-js

**PDF Contract Generation with Digital Signatures**

*A comprehensive TypeScript library for generating PDF contracts from EJS templates with digital signature support.*

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-orange?style=flat-square&logo=pnpm)](https://pnpm.io/)

</div>

---

## 🎯 Purpose

Generate professional PDF contracts from EJS templates with complete digital signature workflow including key generation, signing, and verification.

## 📦 Packages

### `@contract-js/core`

[![npm version](https://img.shields.io/npm/v/@contract-js/core?style=flat-square)](https://www.npmjs.com/package/@contract-js/core)

**PDF Contract Generation from EJS Templates**

Core functionality for generating PDF contracts from EJS templates with digital signature support.

- **PDF Generation** – Convert EJS templates to PDF documents
- **Template Rendering** – Render EJS templates with dynamic data
- **Watermark Support** – Add watermarks to PDF documents

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
# Install globally
npm install -g contract-js

# Generate PDF contract
contract-js generate template.ejs -d data.json -o contract.pdf

# Sign contract
contract-js sign contract.pdf -o ./keys

# Verify signature
contract-js verify contract.pdf -p ./keys/public.pem -s ./keys/signature.txt
```

### Programmatic Usage

```typescript
import { generatePdf } from '@contract-js/core';
import { signContract, verifyContractSignature } from '@contract-js/crypto';

// Generate PDF
const result = await generatePdf({
  templatePath: './template.ejs',
  templateData: { title: 'Service Agreement' }
});

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
# Install all packages
npm install @contract-js/core @contract-js/crypto @contract-js/pdf-utils

# Or install individually
npm install @contract-js/core
npm install @contract-js/crypto
npm install @contract-js/pdf-utils
```

## ⚙️ Tech Stack

| Tool                  | Purpose                                     |
|-----------------------|---------------------------------------------|
| **pnpm + Turbo**      | Monorepo workspace management               |
| **tsup**              | Bundling ESM/CJS with type declarations     |
| **TypeScript**        | Language with strict settings               |
| **ESLint + Prettier** | Code linting and formatting                 |
| **Puppeteer**         | HTML to PDF conversion                      |
| **pdf-lib**           | PDF manipulation                            |
| **EJS**               | Template engine                             |

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
