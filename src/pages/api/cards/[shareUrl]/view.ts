import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { cards, cardViews } from '@/db/schema';
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

  // POST - Log a card view (public endpoint, no auth required)
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

      // Try to get viewer user ID if authenticated
      let viewerUserId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded && decoded.userId) {
          viewerUserId = decoded.userId;
        }
      }

      // Get IP address and user agent
      const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                       (req.headers['x-real-ip'] as string) ||
                       req.socket.remoteAddress ||
                       null;
      
      const userAgent = req.headers['user-agent'] || null;
      const referrer = req.headers['referer'] || req.headers['referrer'] || null;

      // Log the view
      const newView = {
        id: nanoid(),
        cardId: card.id,
        viewerUserId,
        ipAddress,
        userAgent,
        referrer: referrer as string | null,
        location: null, // Could be enhanced with IP geolocation
      };

      await db.insert(cardViews).values(newView);

      return res.status(201).json({
        success: true,
        message: 'View tracked',
      });
    } catch (error) {
      console.error('Error tracking view:', error);
      return res.status(500).json({ success: false, error: 'Failed to track view' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

