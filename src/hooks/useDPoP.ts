import { useState, useEffect, useCallback } from 'react';
import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPrivateKey,
  generateDPoPProof,
  generateNonce,
} from '@/utils/crypto';

const PRIVATE_KEY_STORAGE_KEY = 'dpop_private_key';
const PUBLIC_KEY_STORAGE_KEY = 'dpop_public_key';

export function useDPoP() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize or load keypair
  useEffect(() => {
    async function initializeKeys() {
      try {
        // Check if keys exist in localStorage
        const storedPrivateKey = localStorage.getItem(PRIVATE_KEY_STORAGE_KEY);
        const storedPublicKey = localStorage.getItem(PUBLIC_KEY_STORAGE_KEY);

        if (storedPrivateKey && storedPublicKey) {
          // Load existing keys
          const privateKeyObj = await importPrivateKey(storedPrivateKey);
          setPrivateKey(privateKeyObj);
          setPublicKey(storedPublicKey);
        } else {
          // Generate new keypair
          const keyPair = await generateKeyPair();
          const pubKey = await exportPublicKey(keyPair.publicKey);
          const privKey = await exportPrivateKey(keyPair.privateKey);

          // Store in localStorage
          localStorage.setItem(PRIVATE_KEY_STORAGE_KEY, privKey);
          localStorage.setItem(PUBLIC_KEY_STORAGE_KEY, pubKey);

          setPrivateKey(keyPair.privateKey);
          setPublicKey(pubKey);
        }

        setIsReady(true);
      } catch (error) {
        console.error('Error initializing DPoP keys:', error);
      }
    }

    initializeKeys();
  }, []);

  // Generate DPoP proof for API requests
  const generateProof = useCallback(
    async (method: string, url: string): Promise<string | null> => {
      if (!privateKey || !publicKey) {
        return null;
      }

      try {
        const nonce = generateNonce();
        return await generateDPoPProof(privateKey, publicKey, method, url, nonce);
      } catch (error) {
        console.error('Error generating DPoP proof:', error);
        return null;
      }
    },
    [privateKey, publicKey]
  );

  // Clear keys (for logout)
  const clearKeys = useCallback(() => {
    localStorage.removeItem(PRIVATE_KEY_STORAGE_KEY);
    localStorage.removeItem(PUBLIC_KEY_STORAGE_KEY);
    setPrivateKey(null);
    setPublicKey(null);
    setIsReady(false);
  }, []);

  return {
    publicKey,
    isReady,
    generateProof,
    clearKeys,
  };
}

