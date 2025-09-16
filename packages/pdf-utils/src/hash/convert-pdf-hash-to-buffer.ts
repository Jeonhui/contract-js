export type ConvertPdfHashToBufferProps = {
  encoding?: BufferEncoding;
};

export const convertPdfHashToBuffer = (
  pdfHash: string,
  { encoding = 'hex' }: ConvertPdfHashToBufferProps = {},
): Buffer => {
  return Buffer.from(pdfHash, encoding);
};
