import { readFile } from 'node:fs/promises';
import { OpenMode } from 'node:fs';
import { Abortable } from 'node:events';
import { renderTemplate, TemplateData } from './render-template';
import { generateHtmlToPdf } from './generate-html-to-pdf';
import { getPdfHash } from '@contract-js/pdf-utils';
import { PDFOptions } from 'puppeteer';

export const generatePdf = async ({
  templatePath,
  templateOptions = 'utf-8',
  templateData = {},
  pdfConfig = {},
}: {
  templatePath: string;
  templateOptions?:
    | ({
        encoding: BufferEncoding;
        flag?: OpenMode | undefined;
      } & Abortable)
    | BufferEncoding;
  templateData: TemplateData;
  pdfConfig: {
    options?: PDFOptions;
    metadata?: object;
  };
}): Promise<{
  pdfBuffer: Buffer;
  pdfHash: string;
  pdfKB: number;
}> => {
  let templateContent;
  try {
    templateContent = await readFile(templatePath, templateOptions);
  } catch (error) {
    throw new Error(
      `Failed to read template file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
  const contractHtml = await renderTemplate({
    templateContent,
    templateData,
  });
  const defaultPdfConfig = {
    options: {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    } as PDFOptions,
    metadata: {},
  };
  const pdfOptions = { ...defaultPdfConfig.options, ...pdfConfig.options };
  const pdfMetadata = { createdAt: new Date().toISOString(), ...pdfConfig.metadata };
  const pdfBuffer = await generateHtmlToPdf({
    html: contractHtml,
    pdfOptions: pdfOptions,
    metadata: pdfMetadata,
  });
  const pdfHash = getPdfHash(pdfBuffer);
  const pdfKB = pdfBuffer.length / 1024;
  return {
    pdfHash,
    pdfBuffer,
    pdfKB,
  };
};
