import { renderTemplate, TemplateData } from './render-template';
import { generateHtmlToPdf } from './generate-html-to-pdf';
import { getPdfHash } from '@contract-js/pdf-utils';
import { PDFOptions } from 'puppeteer';

export type PDFResult = {
  pdfBuffer: Buffer;
  pdfHash: string;
  pdfKB: number;
};

export const generatePdf = async ({
  templateContent,
  templateData = {},
  pdfConfig = {},
}: {
  templateContent: string;
  templateData: TemplateData;
  pdfConfig: {
    options?: PDFOptions;
    metadata?: object;
  };
}): Promise<PDFResult> => {
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
