import { sign } from 'crypto';
import { convertPdfHashToBuffer } from '@contract-js/pdf-utils';

export type ContractSignSignature = {
  signature: string;
  signedAt: Date;
};

export type SignContractProps = {
  algorithm: string;
  pdfHash: string;
  privateKey: string;
};

export const signContract = ({
  algorithm,
  pdfHash,
  privateKey,
}: SignContractProps): ContractSignSignature => {
  const signedAt = new Date();
  const pdfHashBuffer = convertPdfHashToBuffer(pdfHash, {});
  const signature = sign(algorithm, pdfHashBuffer, privateKey);
  return {
    signature: signature.toString('base64'),
    signedAt: signedAt,
  };
};
