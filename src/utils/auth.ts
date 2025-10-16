// Server-side authentication utilities
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d'; // 7 days
const CHALLENGE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

export interface TokenPayload {
  userId: string;
  walletAddress: string;
  publicKey: string;
  iat?: number;
  exp?: number;
}

export interface ChallengeData {
  challenge: string;
  expiresAt: number;
}

/**
 * Generate a JWT token with DPoP binding
 */
export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Generate a random authentication challenge
 */
export function generateChallenge(): ChallengeData {
  const challenge = randomBytes(32).toString('base64');
  const expiresAt = Date.now() + CHALLENGE_EXPIRY;
  
  return {
    challenge,
    expiresAt,
  };
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8).toString('hex');
  return prefix ? `${prefix}_${timestamp}${randomPart}` : `${timestamp}${randomPart}`;
}

/**
 * Verify Ethereum signature (for mobile wallet signatures)
 * This is a placeholder - actual implementation will depend on the wallet library used
 */
export function verifyEthereumSignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  // This would use ethers.js or similar to verify the signature
  // For now, we'll return true for development
  // TODO: Implement actual signature verification when mobile app is ready
  console.log('Verifying signature:', { message, signature, expectedAddress });
  return true;
}

/**
 * Extract bearer token from authorization header
 */
export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify DPoP proof
 */
export function verifyDPoPProof(
  proofHeader: string,
  method: string,
  url: string,
  publicKey: string
): boolean {
  try {
    const decoded = JSON.parse(Buffer.from(proofHeader, 'base64').toString());
    const payload = JSON.parse(decoded.payload);
    
    // Check method and URL match
    if (payload.method !== method || payload.url !== url) {
      return false;
    }
    
    // Check public key matches
    if (payload.publicKey !== publicKey) {
      return false;
    }
    
    // Check timestamp is recent (within 1 minute)
    const now = Date.now();
    if (Math.abs(now - payload.timestamp) > 60000) {
      return false;
    }
    
    // TODO: Verify the signature using the public key
    // This would require importing the crypto verification on server side
    
    return true;
  } catch (error) {
    console.error('DPoP proof verification failed:', error);
    return false;
  }
}

