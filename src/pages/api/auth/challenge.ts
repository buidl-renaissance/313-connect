import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { authChallenges } from '@/db/schema';
import { generateChallenge, generateId } from '@/utils/auth';

type ResponseData = {
  success: boolean;
  challengeId?: string;
  challenge?: string;
  expiresAt?: number;
  error?: string;
};

/**
 * POST /api/auth/challenge
 * Generate a new authentication challenge for DPoP flow
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({
        success: false,
        error: 'Public key is required',
      });
    }

    // Generate challenge
    const { challenge, expiresAt } = generateChallenge();
    const challengeId = generateId('chal');

    // Store challenge in database
    await db.insert(authChallenges).values({
      id: challengeId,
      challenge,
      publicKey,
      expiresAt: new Date(expiresAt),
      used: false,
    });

    return res.status(200).json({
      success: true,
      challengeId,
      challenge,
      expiresAt,
    });
  } catch (error) {
    console.error('Error generating challenge:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate challenge',
    });
  }
}

