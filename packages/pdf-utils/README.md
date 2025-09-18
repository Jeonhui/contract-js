[//]: # (@contract-js/pdf-utils - PDF Hash Utilities)

<div align="center">

# 🔍 @contract-js/pdf-utils

**PDF Hash Generation and Comparison**

*Utility functions for PDF hash generation and comparison in contract-js.*

[![npm version](https://img.shields.io/npm/v/@contract-js/pdf-utils?style=flat-square)](https://www.npmjs.com/package/@contract-js/pdf-utils)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 🎯 Purpose

Provide utility functions for generating cryptographic hashes from PDF documents and comparing them to detect changes.

## ✨ Features

- **PDF Hashing** – Generate cryptographic hashes for PDF documents
- **Hash Comparison** – Compare PDF hashes to detect changes
- **Buffer Conversion** – Convert PDF hashes to buffers for cryptographic operations
- **Multiple Algorithms** – Support for various hash algorithms

## 🚀 Usage

### Generate PDF Hash

```typescript
import { getPdfHash } from '@contract-js/pdf-utils';

const pdfBuffer = fs.readFileSync('contract.pdf');
const hash = getPdfHash(pdfBuffer, {
  hashAlgorithm: 'sha256'
});

console.log('PDF Hash:', hash);
```

### Compare PDF Hashes

```typescript
import { comparePdfHash } from '@contract-js/pdf-utils';

const isIdentical = comparePdfHash(originalHash, currentHash);
console.log('PDFs identical:', isIdentical);
```

### Convert Hash to Buffer

```typescript
import { convertPdfHashToBuffer } from '@contract-js/pdf-utils';

const hashBuffer = convertPdfHashToBuffer(hashString, {
  encoding: 'hex'
});
```

## 📦 Installation

```bash
# npm
npm install @contract-js/pdf-utils

# pnpm (recommended)
pnpm add @contract-js/pdf-utils

# yarn
yarn add @contract-js/pdf-utils
```

## 📋 API Reference

| Function | Description | Parameters |
|----------|-------------|------------|
| `getPdfHash` | Generate hash from PDF buffer | `pdfBuffer`, `options` |
| `comparePdfHash` | Compare two PDF hashes | `hash1`, `hash2` |
| `convertPdfHashToBuffer` | Convert hash to buffer | `hash`, `options` |

## 🔒 Supported Algorithms

- **SHA-1** – 160-bit hash (fast but less secure)
- **SHA-256** – 256-bit hash (recommended)
- **SHA-384** – 384-bit hash (high security)
- **SHA-512** – 512-bit hash (maximum security)

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