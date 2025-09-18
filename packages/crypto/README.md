[//]: # (@contract-js/crypto - Digital Signature Utilities)

<div align="center">

# 🔐 @contract-js/crypto

**Digital Signature Generation and Verification**

*Cryptographic utilities for digital signature generation and verification in contract-js.*

[![npm version](https://img.shields.io/npm/v/@contract-js/crypto?style=flat-square)](https://www.npmjs.com/package/@contract-js/crypto)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 🎯 Purpose

Provide cryptographic utilities for generating RSA key pairs, creating digital signatures, and verifying signatures for PDF contracts.

## ✨ Features

- **RSA Key Generation** – Generate RSA key pairs for digital signatures
- **Digital Signing** – Create digital signatures for PDF contracts
- **Signature Verification** – Verify digital signatures against PDF hashes
- **Multiple Algorithms** – Support for SHA-1, SHA-256, SHA-384, SHA-512

## 🚀 Usage

### Key Generation

```typescript
import { generateRsaKeyPairSync } from '@contract-js/crypto';

const { publicKey, privateKey } = generateRsaKeyPairSync();
console.log('Keys generated successfully');
```

### Digital Signing

```typescript
import { signContract } from '@contract-js/crypto';

const signature = await signContract({
  pdfHash: 'abc123...', // SHA-256 hash of the PDF
  privateKey: privateKeyPem,
  algorithm: 'sha256'
});

console.log('Signature:', signature.signature);
console.log('Signed at:', signature.signedAt);
```

### Signature Verification

```typescript
import { verifyContractSignature } from '@contract-js/crypto';

const isValid = verifyContractSignature({
  algorithm: 'sha256',
  pdfHash: 'abc123...',
  publicKey: publicKeyPem,
  signature: signatureString
});

console.log('Signature valid:', isValid);
```

## 📦 Installation

```bash
# npm
npm install @contract-js/crypto

# pnpm (recommended)
pnpm add @contract-js/crypto

# yarn
yarn add @contract-js/crypto
```

## 📋 API Reference

| Function | Description | Parameters |
|----------|-------------|------------|
| `generateRsaKeyPairSync` | Generate RSA key pair | None |
| `signContract` | Create digital signature | `pdfHash`, `privateKey`, `algorithm` |
| `verifyContractSignature` | Verify signature | `algorithm`, `pdfHash`, `publicKey`, `signature` |

## 🔒 Supported Algorithms

- **SHA-1** – Fast but less secure
- **SHA-256** – Recommended for most use cases
- **SHA-384** – Higher security
- **SHA-512** – Maximum security

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