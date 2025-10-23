import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { cards, cardShares } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyToken } from '@/utils/auth';
import { nanoid } from 'nanoid';

// Generate a short, unique URL code
function generateShareUrl(): string {
  return nanoid(8);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET - List user's cards
  if (req.method === 'GET') {
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

      const userCards = await db
        .select()
        .from(cards)
        .where(eq(cards.userId, decoded.userId))
        .orderBy(desc(cards.createdAt));

      return res.status(200).json({
        success: true,
        cards: userCards,
      });
    } catch (error) {
      console.error('Error fetching cards:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch cards' });
    }
  }

  // POST - Create new card
  if (req.method === 'POST') {
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

      const { offeringId, title, sharedVia = 'link' } = req.body;

      // Generate unique share URL
      let shareUrl = generateShareUrl();
      
      // Ensure uniqueness (very unlikely collision, but just in case)
      let attempts = 0;
      while (attempts < 5) {
        const existing = await db
          .select()
          .from(cards)
          .where(eq(cards.shareUrl, shareUrl))
          .limit(1);
        
        if (existing.length === 0) break;
        shareUrl = generateShareUrl();
        attempts++;
      }

      const newCard = {
        id: nanoid(),
        userId: decoded.userId,
        offeringId: offeringId || null,
        shareUrl,
        title: title || null,
      };

      await db.insert(cards).values(newCard);

      // Log the share event
      await db.insert(cardShares).values({
        id: nanoid(),
        cardId: newCard.id,
        sharedBy: decoded.userId,
        sharedVia,
      });

      return res.status(201).json({
        success: true,
        card: newCard,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cards/${shareUrl}`,
      });
    } catch (error) {
      console.error('Error creating card:', error);
      return res.status(500).json({ success: false, error: 'Failed to create card' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

