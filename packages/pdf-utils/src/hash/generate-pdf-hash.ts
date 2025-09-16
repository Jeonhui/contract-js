import { createHash, HashOptions, BinaryToTextEncoding } from 'crypto';

export type CreatePdfHashProps = {
  hashAlgorithm?: string;
  hashOptions?: HashOptions;
  digestEncoding?: BinaryToTextEncoding;
};

export const generatePdfHash = (
  pdfBuffer: Buffer,
  { hashAlgorithm = 'sha256', hashOptions, digestEncoding = 'hex' }: CreatePdfHashProps,
): string => {
  return createHash(hashAlgorithm, hashOptions).update(pdfBuffer).digest(digestEncoding);
};
