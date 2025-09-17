import { getPdfHash, CreatePdfHashProps } from './get-pdf-hash';

export type ComparePdfHashProps = {
  expectedHash: string;
  pdfHashProps?: CreatePdfHashProps;
  throwOnMismatch?: boolean;
};

export const comparePdfHash = (
  pdfBuffer: Buffer,
  { expectedHash, pdfHashProps = {}, throwOnMismatch = false }: ComparePdfHashProps,
): boolean => {
  const hash = getPdfHash(pdfBuffer, pdfHashProps);
  const match = hash === expectedHash;
  if (!match && throwOnMismatch) throw new Error('PDF hash mismatch');
  return match;
};

export const comparePdfHashString = (
  pdfHash: string,
  { expectedHash, throwOnMismatch = false }: Omit<ComparePdfHashProps, 'pdfHashProps'>,
): boolean => {
  const match = pdfHash === expectedHash;
  if (!match && throwOnMismatch) throw new Error('PDF hash mismatch');
  return match;
};
