[//]: # (contract-js CLI - Command Line Interface)

<div align="center">

# ⚡ contract-js CLI

**Command Line Interface for PDF Contract Generation**

*Generate, sign, and verify PDF contracts from the command line with a beautiful and user-friendly interface.*

[![npm version](https://img.shields.io/npm/v/@contract-js/cli?style=flat-square)](https://www.npmjs.com/package/@contract-js/cli)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 🎯 Purpose

Provide a command-line interface for generating PDF contracts from EJS templates with digital signature support, featuring an intuitive and visually appealing user experience.

## ✨ Features

- **📄 PDF Generation** – Generate PDF contracts from EJS templates
- **✍️ Digital Signing** – Create digital signatures for PDF contracts
- **🔍 Signature Verification** – Verify digital signatures
- **🔐 Hash Generation** – Generate cryptographic hashes for PDF files
- **🎨 Beautiful UI** – Colorful and interactive command-line interface
- **⚙️ Flexible Options** – Comprehensive configuration options

## 🚀 Installation

```bash
# Install globally
npm install -g contract-js

# Or use with npx
npx contract-js --help
```

## 📋 Commands

### Generate PDF Contract

```bash
# Basic generation
contract-js generate template.ejs

# With data and output
contract-js generate template.ejs -d data.json -o contract.pdf

# With custom output directory
contract-js generate template.ejs -o ./output/contract.pdf
```

**Options:**
- `-d, --data <data>` – JSON data file path for template variables
- `-o, --output <output>` – Output PDF file path (default: contract.pdf)

### Sign PDF Contract

```bash
# Generate new keys and sign
contract-js sign contract.pdf

# Use existing private key
contract-js sign contract.pdf -k ./keys/private.pem

# Custom output directory
contract-js sign contract.pdf -o ./my-keys

# Different hash algorithm
contract-js sign contract.pdf -a sha256
```

**Options:**
- `-k, --key <key>` – Private key file path (PEM format)
- `-o, --output <output>` – Output directory for keys (default: ./keys)
- `-a, --algorithm <algorithm>` – Hash algorithm (default: sha256)

### Verify Digital Signature

```bash
# Verify signature
contract-js verify contract.pdf -p ./keys/public.pem -s ./keys/signature.txt

# Different hash algorithm
contract-js verify contract.pdf -a sha256 -p ./keys/public.pem -s ./keys/signature.txt
```

**Options:**
- `-p, --public-key <publicKey>` – Public key file path (PEM format)
- `-s, --signature <signature>` – Signature file path (TXT format)
- `-a, --algorithm <algorithm>` – Hash algorithm (default: sha256)

### Generate Hash

```bash
# Generate hash for PDF
contract-js hash contract.pdf

# Different hash algorithm
contract-js hash contract.pdf -a sha256
```

**Options:**
- `-a, --algorithm <algorithm>` – Hash algorithm (default: sha256)

## 🎨 User Interface

The CLI features a beautiful and interactive interface with:

- **Colorful Output** – Different colors for different types of information
- **Progress Indicators** – Spinners and progress bars for long operations
- **Step-by-step Feedback** – Clear indication of what's happening
- **Error Handling** – User-friendly error messages
- **Success Confirmation** – Clear success messages with details

## 📁 File Structure

```
keys/
├── public.pem      # Public key
├── private.pem     # Private key (keep secure!)
└── signature.txt   # Digital signature
```

## 🔒 Security Considerations

- **Private Key Security** – Never share or expose private keys
- **File Permissions** – Ensure proper file permissions for key files
- **Algorithm Choice** – Use SHA-256 or higher for new implementations
- **Key Rotation** – Regularly rotate key pairs for enhanced security

## 📦 Dependencies

- **@clack/prompts** – Beautiful command-line prompts
- **picocolors** – Tiny color library
- **cac** – Command and option parser
- **zod** – Schema validation

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Run locally
pnpm dev

# Test commands
pnpm test
```

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
