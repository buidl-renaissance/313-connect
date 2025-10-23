import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { cards, offerings, profiles, identities, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shareUrl } = req.query;

  if (!shareUrl || typeof shareUrl !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid share URL' });
  }

  // GET - Get card details (public, no auth required)
  if (req.method === 'GET') {
    try {
      // Find the card
      const cardResult = await db
        .select()
        .from(cards)
        .where(eq(cards.shareUrl, shareUrl))
        .limit(1);

      if (cardResult.length === 0) {
        return res.status(404).json({ success: false, error: 'Card not found' });
      }

      const card = cardResult[0];

      // Get user info
      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.id, card.userId))
        .limit(1);

      if (userResult.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Get profile
      const profileResult = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, card.userId))
        .limit(1);

      // Get identity (313 number)
      const identityResult = await db
        .select()
        .from(identities)
        .where(eq(identities.userId, card.userId))
        .limit(1);

      // Get offering if associated
      let offering = null;
      if (card.offeringId) {
        const offeringResult = await db
          .select()
          .from(offerings)
          .where(eq(offerings.id, card.offeringId))
          .limit(1);
        
        if (offeringResult.length > 0) {
          offering = offeringResult[0];
        }
      }

      const profile = profileResult[0] || null;
      const identity = identityResult[0] || null;

      return res.status(200).json({
        success: true,
        card: {
          id: card.id,
          title: card.title,
          shareUrl: card.shareUrl,
          createdAt: card.createdAt,
        },
        user: {
          id: userResult[0].id,
        },
        profile: profile ? {
          displayName: profile.displayName,
          bio: profile.bio,
          tagline: profile.tagline,
          region: profile.region,
          contactEmail: profile.contactEmail,
          contactPhone: profile.contactPhone,
          socialLinks: profile.socialLinks,
        } : null,
        identity: identity ? {
          number: identity.number,
          fullNumber: `313#${identity.number}`,
        } : null,
        offering,
      });
    } catch (error) {
      console.error('Error fetching card:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch card' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

