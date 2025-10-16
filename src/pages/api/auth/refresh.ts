import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { users, profiles, identities } from '@/db/schema';
import { verifyToken, generateToken, extractBearerToken } from '@/utils/auth';

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
 * POST /api/auth/refresh
 * Refresh JWT token with DPoP proof
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
    // Extract token from Authorization header
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    // Verify existing token
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    // Fetch user data
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get user's identity if exists
    const [identity] = await db
      .select()
      .from(identities)
      .where(eq(identities.userId, user.id))
      .limit(1);

    // Get user's profile
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1);

    // Generate new token
    const newToken = generateToken({
      userId: user.id,
      walletAddress: user.walletAddress,
      publicKey: payload.publicKey,
    });

    return res.status(200).json({
      success: true,
      token: newToken,
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
    console.error('Error refreshing token:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to refresh token',
    });
  }
}

