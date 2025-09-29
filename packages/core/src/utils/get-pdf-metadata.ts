import { PDFDocument } from 'pdf-lib';
import { PDFMetadata } from '../types';

export const getPdfMetadata = async (pdfBuffer: Buffer): Promise<PDFMetadata> => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });
    const title = pdfDoc.getTitle() || undefined;
    const author = pdfDoc.getAuthor() || undefined;
    const subject = pdfDoc.getSubject() || undefined;
    const keywords = pdfDoc.getKeywords()
      ? pdfDoc
          .getKeywords()
          ?.split(',')
          .map((k) => k.trim())
      : undefined;
    const producer = pdfDoc.getProducer() || undefined;
    const creator = pdfDoc.getCreator() || undefined;
    const createDate = pdfDoc.getCreationDate() || undefined;
    const modDate = pdfDoc.getModificationDate() || undefined;

    return {
      title,
      author,
      subject,
      keywords,
      producer,
      creator,
      createDate,
      modDate,
    };
  } catch (error) {
    throw new Error(
      `Failed to extract PDF metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
