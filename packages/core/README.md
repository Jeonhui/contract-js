[//]: # (@contract-js/core - PDF Contract Generation)

<div align="center">

# 📄 @contract-js/core

**PDF Contract Generation from EJS Templates**

*Generate PDF contracts from EJS templates with digital signature support and comprehensive metadata management.*

[![npm version](https://img.shields.io/npm/v/@contract-js/core?style=flat-square)](https://www.npmjs.com/package/@contract-js/core)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=flat-square)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 🎯 Purpose

Generate professional PDF contracts from EJS templates with support for dynamic data, comprehensive metadata management, and digital signature integration.

## ✨ Features

- **PDF Generation** – Convert EJS templates to PDF documents using Puppeteer
- **Template Rendering** – Render EJS templates with dynamic data
- **Metadata Management** – Set and extract PDF metadata (title, author, creator, producer, etc.)
- **Template Loading** – Load EJS templates from file system
- **Digital Signature Ready** – Generate PDFs compatible with digital signatures
- **TypeScript Support** – Full TypeScript support with comprehensive type definitions

## 🚀 Usage

### Basic PDF Generation

```typescript
import { generatePdf } from '@contract-js/core';

const result = await generatePdf({
  templateContent: '<h1>Hello <%= name %>!</h1>',
  templateData: {
    name: 'John Doe'
  },
  pdfConfig: {
    metadata: {
      title: 'Sample Contract',
      author: 'ABC Corp',
      creator: 'Contract-JS',
      producer: 'Contract-JS PDF Engine'
    }
  }
});

console.log(`PDF generated: ${result.pdfKB}KB`);
console.log(`Hash: ${result.pdfHash}`);
```

### Template Loading and Rendering

```typescript
import { loadTemplate, generatePdf } from '@contract-js/core';

// Load template from file
const templateContent = await loadTemplate({
  templatePath: './template.ejs'
});

// Generate PDF with loaded template
const result = await generatePdf({
  templateContent,
  templateData: {
    title: 'Service Agreement',
    clientName: 'John Doe',
    date: '2024-01-15'
  },
  pdfConfig: {
    options: {
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      }
    },
    metadata: {
      title: 'Service Agreement',
      author: 'ABC Corp',
      creator: 'Contract-JS Generator',
      producer: 'Contract-JS PDF Engine',
      keywords: ['contract', 'agreement', 'service']
    }
  }
});
```

### PDF Metadata Extraction

```typescript
import { getPdfMetadata } from '@contract-js/core';
import { readFile } from 'node:fs/promises';

const pdfBuffer = await readFile('contract.pdf');
const metadata = await getPdfMetadata(pdfBuffer);

console.log('PDF Metadata:', {
  title: metadata.title,
  author: metadata.author,
  creator: metadata.creator,
  producer: metadata.producer,
  createDate: metadata.createDate,
  modDate: metadata.modDate
});
```

## 📦 Installation

```bash
# npm
npm install @contract-js/core

# pnpm (recommended)
pnpm add @contract-js/core

# yarn
yarn add @contract-js/core
```

## 📋 API Reference

### Core Functions

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `generatePdf` | Generate PDF from EJS template | `templateContent`, `templateData`, `templateOptions?`, `pdfConfig?` | `Promise<PDFResult>` |
| `loadTemplate` | Load EJS template from file | `templatePath`, `templateReadOptions?` | `Promise<string>` |
| `getPdfMetadata` | Extract metadata from PDF | `pdfBuffer` | `Promise<PDFMetadata>` |

### Types

#### PDFResult
```typescript
type PDFResult = {
  pdfBuffer: Buffer;
  pdfHash: string;
  pdfKB: number;
};
```

#### PDFMetadata
```typescript
type PDFMetadata = {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  producer?: string;
  creator?: string;
  createDate?: Date;
  modDate?: Date;
};
```

#### TemplateData
```typescript
type TemplateData = {
  [key: string]: string | number | TemplateData;
};
```

### PDF Configuration Options

The `pdfConfig` parameter accepts:

```typescript
{
  options?: PDFOptions; // Puppeteer PDF options
  metadata?: PDFMetadata; // PDF metadata
}
```

#### Default PDF Options
- **Format**: A4
- **Print Background**: true
- **Margins**: 20mm top/bottom, 15mm left/right

#### Default Metadata
- **Creator**: Contract-JS Generator
- **Producer**: Contract-JS PDF Engine
- **Create Date**: Current date

## 🔧 Advanced Usage

### Custom PDF Options

```typescript
const result = await generatePdf({
  templateContent,
  templateData,
  pdfConfig: {
    options: {
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '1in',
        bottom: '1in',
        left: '0.5in',
        right: '0.5in'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div>Header</div>',
      footerTemplate: '<div>Footer</div>'
    }
  }
});
```

### Template Options

```typescript
const result = await generatePdf({
  templateContent,
  templateData,
  templateOptions: {
    delimiter: '%',
    openDelimiter: '<%',
    closeDelimiter: '%>',
    strict: false
  }
});
```

## 🛠️ Dependencies

- **pdf-lib**: PDF manipulation and metadata management
- **puppeteer**: HTML to PDF conversion
- **ejs**: Template engine
- **@contract-js/pdf-utils**: PDF utilities (hash generation)

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