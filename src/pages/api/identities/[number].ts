import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db/client';
import { identities, profiles } from '@/db/schema';

type ResponseData = {
  success: boolean;
  identity?: {
    number: string;
    fullNumber: string;
    claimedAt: Date;
    profile?: {
      displayName: string | null;
      region: string | null;
    };
  };
  error?: string;
};

/**
 * GET /api/identities/[number]
 * Get identity details by number (public endpoint with limited info)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { number } = req.query;

    if (!number || typeof number !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid number parameter',
      });
    }

    // Remove '313' prefix if present
    const numberStr = number.startsWith('313') ? number.substring(3) : number;

    // Fetch identity
    const [identity] = await db
      .select()
      .from(identities)
      .where(
        and(
          eq(identities.number, numberStr),
          eq(identities.isActive, true)
        )
      )
      .limit(1);

    if (!identity) {
      return res.status(404).json({
        success: false,
        error: 'Identity not found',
      });
    }

    // Fetch associated profile (public info only)
    const [profile] = await db
      .select({
        displayName: profiles.displayName,
        region: profiles.region,
      })
      .from(profiles)
      .where(eq(profiles.userId, identity.userId))
      .limit(1);

    return res.status(200).json({
      success: true,
      identity: {
        number: identity.number,
        fullNumber: `313#${identity.number}`,
        claimedAt: identity.claimedAt,
        profile: profile || undefined,
      },
    });
  } catch (error) {
    console.error('Error fetching identity:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch identity',
    });
  }
}

