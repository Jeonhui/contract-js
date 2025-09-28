import { PDFDocument } from 'pdf-lib';
import puppeteer, { PDFOptions } from 'puppeteer';
import { PDFMetadata } from '../types';

export const generateHtmlToPdf = async ({
  html,
  pdfOptions,
  metadata,
}: {
  html: string;
  pdfOptions?: PDFOptions;
  metadata: PDFMetadata;
}): Promise<Buffer> => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf(pdfOptions);
    await page.close();
    await browser.close();
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    if (metadata.title) pdfDoc.setTitle(metadata.title);
    if (metadata.author) pdfDoc.setAuthor(metadata.author);
    if (metadata.subject) pdfDoc.setSubject(metadata.subject);
    if (metadata.keywords) pdfDoc.setKeywords(metadata.keywords);
    if (metadata.producer) pdfDoc.setProducer(metadata.producer);
    if (metadata.creator) pdfDoc.setCreator(metadata.creator);
    if (metadata.createDate) pdfDoc.setCreationDate(metadata.createDate);
    if (metadata.modDate) pdfDoc.setModificationDate(metadata.modDate);
    const finalPdf = await pdfDoc.save();
    return Buffer.from(finalPdf);
  } catch (error) {
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
