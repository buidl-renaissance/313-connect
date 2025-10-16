import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { profiles, identities } from '@/db/schema';
import { verifyToken, extractBearerToken } from '@/utils/auth';

type ResponseData = {
  success: boolean;
  profile?: {
    displayName: string | null;
    bio: string | null;
    region: string | null;
    verificationStatus: string;
    identity?: {
      number: string;
      fullNumber: string;
    };
  };
  error?: string;
};

/**
 * GET /api/profile - Get authenticated user's profile
 * PUT /api/profile - Update authenticated user's profile
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Verify authentication
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, payload.userId);
  } else if (req.method === 'PUT') {
    return handlePut(req, res, payload.userId);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
  userId: string
) {
  try {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
      });
    }

    // Get user's identity if exists
    const [identity] = await db
      .select()
      .from(identities)
      .where(eq(identities.userId, userId))
      .limit(1);

    return res.status(200).json({
      success: true,
      profile: {
        displayName: profile.displayName,
        bio: profile.bio,
        region: profile.region,
        verificationStatus: profile.verificationStatus,
        identity: identity ? {
          number: identity.number,
          fullNumber: `313-${identity.number}`,
        } : undefined,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
    });
  }
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
  userId: string
) {
  try {
    const { displayName, bio, region } = req.body;

    // Validate input
    if (displayName && typeof displayName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid displayName',
      });
    }

    if (bio && typeof bio !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid bio',
      });
    }

    if (region && typeof region !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid region',
      });
    }

    // Update profile
    const updateData: {
      displayName?: string;
      bio?: string;
      region?: string;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (region !== undefined) updateData.region = region;

    await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.userId, userId));

    // Fetch updated profile
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    // Get user's identity if exists
    const [identity] = await db
      .select()
      .from(identities)
      .where(eq(identities.userId, userId))
      .limit(1);

    return res.status(200).json({
      success: true,
      profile: {
        displayName: profile?.displayName || null,
        bio: profile?.bio || null,
        region: profile?.region || null,
        verificationStatus: profile?.verificationStatus || 'unverified',
        identity: identity ? {
          number: identity.number,
          fullNumber: `313-${identity.number}`,
        } : undefined,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
}

