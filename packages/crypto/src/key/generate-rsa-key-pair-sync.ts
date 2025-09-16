import { generateKeyPairSync as nodeGenerateKeyPair, RSAKeyPairOptions } from 'crypto';

export type RSAKeyPair = {
  publicKey: string;
  privateKey: string;
};

export const generateRsaKeyPairSync = (
  options: RSAKeyPairOptions<'pem', 'pem'> = {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  },
): RSAKeyPair => {
  const { publicKey, privateKey } = nodeGenerateKeyPair('rsa', options);
  return {
    publicKey: publicKey,
    privateKey: privateKey,
  };
};
