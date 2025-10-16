// Web Crypto API utilities for client-side key management

export interface KeyPairInfo {
  publicKey: string;
  privateKey: string;
}

/**
 * Generate an ECDSA key pair for DPoP authentication
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true, // extractable
    ['sign', 'verify']
  );
}

/**
 * Export a public key to JWK format
 */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const jwk = await window.crypto.subtle.exportKey('jwk', publicKey);
  return JSON.stringify(jwk);
}

/**
 * Export a private key to JWK format
 */
export async function exportPrivateKey(privateKey: CryptoKey): Promise<string> {
  const jwk = await window.crypto.subtle.exportKey('jwk', privateKey);
  return JSON.stringify(jwk);
}

/**
 * Import a public key from JWK format
 */
export async function importPublicKey(jwkString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkString);
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['verify']
  );
}

/**
 * Import a private key from JWK format
 */
export async function importPrivateKey(jwkString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkString);
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign']
  );
}

/**
 * Sign data with a private key
 */
export async function signData(privateKey: CryptoKey, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const signature = await window.crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    privateKey,
    dataBuffer
  );
  
  return bufferToBase64(signature);
}

/**
 * Verify a signature with a public key
 */
export async function verifySignature(
  publicKey: CryptoKey,
  signature: string,
  data: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const signatureBuffer = base64ToBuffer(signature);
  
  return await window.crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    publicKey,
    signatureBuffer,
    dataBuffer
  );
}

/**
 * Generate a random nonce
 */
export function generateNonce(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return bufferToBase64(array);
}

/**
 * Hash data using SHA-256
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  return bufferToBase64(hashBuffer);
}

// Helper functions
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a DPoP proof token
 */
export async function generateDPoPProof(
  privateKey: CryptoKey,
  publicKeyJwk: string,
  method: string,
  url: string,
  nonce: string
): Promise<string> {
  const timestamp = Date.now();
  const payload = {
    method,
    url,
    nonce,
    timestamp,
    publicKey: publicKeyJwk,
  };
  
  const payloadString = JSON.stringify(payload);
  const signature = await signData(privateKey, payloadString);
  
  return btoa(JSON.stringify({
    payload: payloadString,
    signature,
  }));
}

