import { PDFDocument } from 'pdf-lib';
import { PDFPageDrawTextOptions } from 'pdf-lib/cjs/api/PDFPageOptions';

export const addWatermark = async (
  pdfBuffer: Buffer,
  {
    text,
    options,
  }: {
    text: string;
    options: PDFPageDrawTextOptions;
  },
): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    page.drawText(text, options);
  }
  const modifiedPdf = await pdfDoc.save();
  return Buffer.from(modifiedPdf);
};
