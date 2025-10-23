import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { referrals, users, profiles, identities } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    // Get user's referrals
    const userReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, decoded.userId))
      .orderBy(desc(referrals.createdAt));

    // Enrich referrals with referred user data
    const enrichedReferrals = await Promise.all(
      userReferrals.map(async (referral) => {
        if (!referral.referredUserId) {
          return {
            ...referral,
            referredUser: null,
          };
        }

        const profile = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, referral.referredUserId))
          .limit(1);

        const identity = await db
          .select()
          .from(identities)
          .where(eq(identities.userId, referral.referredUserId))
          .limit(1);

        return {
          ...referral,
          referredUser: {
            profile: profile[0] || null,
            identity: identity[0] || null,
          },
        };
      })
    );

    // Calculate totals
    const totalReferrals = enrichedReferrals.length;
    const completedReferrals = enrichedReferrals.filter(r => r.status === 'completed').length;
    const pendingReferrals = enrichedReferrals.filter(r => r.status === 'pending').length;

    return res.status(200).json({
      success: true,
      referrals: enrichedReferrals,
      stats: {
        total: totalReferrals,
        completed: completedReferrals,
        pending: pendingReferrals,
      },
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch referrals' });
  }
}

