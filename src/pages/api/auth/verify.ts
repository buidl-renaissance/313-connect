import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db/client';
import { authChallenges, users, profiles, identities } from '@/db/schema';
import { generateToken, verifyEthereumSignature, generateId } from '@/utils/auth';

type ResponseData = {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    walletAddress: string;
    identity?: {
      number: string;
    };
    profile?: {
      displayName: string | null;
      region: string | null;
    };
  };
  error?: string;
};

/**
 * POST /api/auth/verify
 * Verify signature from mobile app and issue JWT token
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
    const { challengeId, signature, walletAddress } = req.body;

    if (!challengeId || !signature || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Fetch challenge from database
    const [challengeData] = await db
      .select()
      .from(authChallenges)
      .where(
        and(
          eq(authChallenges.id, challengeId),
          eq(authChallenges.used, false)
        )
      )
      .limit(1);

    if (!challengeData) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired challenge',
      });
    }

    // Check if challenge has expired
    if (challengeData.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        error: 'Challenge has expired',
      });
    }

    // Verify signature
    const isValidSignature = verifyEthereumSignature(
      challengeData.challenge,
      signature,
      walletAddress
    );

    if (!isValidSignature) {
      return res.status(401).json({
        success: false,
        error: 'Invalid signature',
      });
    }

    // Mark challenge as used
    await db
      .update(authChallenges)
      .set({ used: true, walletAddress })
      .where(eq(authChallenges.id, challengeId));

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);

    if (!user) {
      // Create new user
      const userId = generateId('user');
      await db.insert(users).values({
        id: userId,
        walletAddress,
      });

      // Create profile
      const profileId = generateId('prof');
      await db.insert(profiles).values({
        id: profileId,
        userId,
      });

      user = {
        id: userId,
        walletAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Get user's identity if exists
    const [identity] = await db
      .select()
      .from(identities)
      .where(and(
        eq(identities.userId, user.id),
        eq(identities.isActive, true)
      ))
      .limit(1);

    // Get user's profile
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      walletAddress: user.walletAddress,
      publicKey: challengeData.publicKey,
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        identity: identity ? { number: identity.number } : undefined,
        profile: profile ? {
          displayName: profile.displayName,
          region: profile.region,
        } : undefined,
      },
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify signature',
    });
  }
}

