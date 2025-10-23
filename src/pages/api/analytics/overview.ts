import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { cards, cardViews, cardShares, conversions, referrals } from '@/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';
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

    // Get user's cards
    const userCards = await db
      .select({ id: cards.id })
      .from(cards)
      .where(eq(cards.userId, decoded.userId));

    const cardIds = userCards.map(c => c.id);

    if (cardIds.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalCards: 0,
          totalViews: 0,
          totalShares: 0,
          totalConversions: 0,
          totalReferrals: 0,
          recentViews: [],
          topCards: [],
        },
      });
    }

    // Count total views
    const viewsResult = await db
      .select({ count: count() })
      .from(cardViews)
      .where(sql`${cardViews.cardId} IN ${cardIds}`);

    // Count total shares
    const sharesResult = await db
      .select({ count: count() })
      .from(cardShares)
      .where(sql`${cardShares.cardId} IN ${cardIds}`);

    // Count total conversions
    const conversionsResult = await db
      .select({ count: count() })
      .from(conversions)
      .where(sql`${conversions.cardId} IN ${cardIds}`);

    // Count referrals where user is the referrer
    const referralsResult = await db
      .select({ count: count() })
      .from(referrals)
      .where(eq(referrals.referrerId, decoded.userId));

    // Get recent views (last 10)
    const recentViews = await db
      .select({
        cardId: cardViews.cardId,
        viewedAt: cardViews.viewedAt,
        referrer: cardViews.referrer,
      })
      .from(cardViews)
      .where(sql`${cardViews.cardId} IN ${cardIds}`)
      .orderBy(sql`${cardViews.viewedAt} DESC`)
      .limit(10);

    // Get top performing cards
    const topCardsData = await db
      .select({
        cardId: cardViews.cardId,
        viewCount: count(),
      })
      .from(cardViews)
      .where(sql`${cardViews.cardId} IN ${cardIds}`)
      .groupBy(cardViews.cardId)
      .orderBy(sql`count(*) DESC`)
      .limit(5);

    // Enrich top cards with card details
    const topCards = await Promise.all(
      topCardsData.map(async (item) => {
        const cardDetails = await db
          .select()
          .from(cards)
          .where(eq(cards.id, item.cardId))
          .limit(1);
        
        return {
          ...item,
          card: cardDetails[0] || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      analytics: {
        totalCards: userCards.length,
        totalViews: viewsResult[0]?.count || 0,
        totalShares: sharesResult[0]?.count || 0,
        totalConversions: conversionsResult[0]?.count || 0,
        totalReferrals: referralsResult[0]?.count || 0,
        recentViews,
        topCards,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
}

