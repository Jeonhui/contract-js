import { verify } from 'crypto';
import { convertPdfHashToBuffer } from '@contract-js/pdf-utils';

export type VerifyContractSignatureProps = {
  algorithm: string;
  pdfHash: string;
  publicKey: string;
  signature: string;
};

export const verifyContractSignature = ({
  algorithm,
  pdfHash,
  publicKey,
  signature,
}: VerifyContractSignatureProps): boolean => {
  const pdfBuffer = convertPdfHashToBuffer(pdfHash, {});
  const signatureBuffer = Buffer.from(signature, 'base64');
  return verify(algorithm, pdfBuffer, publicKey, signatureBuffer);
};
