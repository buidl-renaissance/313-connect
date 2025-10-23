import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { cards, conversions, referrals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { shareUrl } = req.query;

  if (!shareUrl || typeof shareUrl !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid share URL' });
  }

  // POST - Log a conversion (optionally authenticated)
  if (req.method === 'POST') {
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
      const { conversionType = 'contact' } = req.body;

      // Try to get viewer user ID if authenticated
      let viewerId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded && decoded.userId) {
          viewerId = decoded.userId;
        }
      }

      // Log the conversion
      const newConversion = {
        id: nanoid(),
        cardId: card.id,
        viewerId,
        conversionType,
      };

      await db.insert(conversions).values(newConversion);

      // If viewer is authenticated and different from card owner, create a referral
      if (viewerId && viewerId !== card.userId) {
        const existingReferral = await db
          .select()
          .from(referrals)
          .where(eq(referrals.cardId, card.id))
          .limit(1);

        // Only create if no referral exists for this card
        if (existingReferral.length === 0) {
          await db.insert(referrals).values({
            id: nanoid(),
            referrerId: card.userId,
            referredUserId: viewerId,
            cardId: card.id,
            status: 'completed',
            commissionAmount: null,
            commissionPaid: false,
          });
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Conversion tracked',
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
      return res.status(500).json({ success: false, error: 'Failed to track conversion' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

