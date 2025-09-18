import { readFile } from 'node:fs/promises';
import { OpenMode } from 'node:fs';
import { Abortable } from 'node:events';
import { renderTemplate, TemplateData } from './render-template';
import { generateHtmlToPdf } from './generate-html-to-pdf';
import { getPdfHash } from '@contract-js/pdf-utils';

export const generatePdf = async ({
  templatePath,
  templateOptions = 'utf-8',
  templateData = {},
}: {
  templatePath: string;
  templateOptions?:
    | ({
        encoding: BufferEncoding;
        flag?: OpenMode | undefined;
      } & Abortable)
    | BufferEncoding;
  templateData: TemplateData;
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
  const pdfBuffer = await generateHtmlToPdf({
    html: contractHtml,
    pdfOptions: {
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
      createdAt: new Date().toISOString(),
    },
  });
  const pdfHash = getPdfHash(pdfBuffer);
  const pdfKB = pdfBuffer.length / 1024;
  return {
    pdfHash,
    pdfBuffer,
    pdfKB,
  };
};
